'use client';
import React, { useCallback, useEffect } from 'react';
import { useFilePicker, FileContent } from 'use-file-picker';
import { useRecipeContext } from '@/providers/recipe-context';
import { RecipeMediaViewImage } from '@/components/Recipe/RecipeMedia/RecipeMediaViewImage';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import log from '@/libs/logger';
import { trpc } from '@/trpc/client';

export default function RecipeMediaPage() {
  const rtx = useRecipeContext();
  const user = trpc.users.getAuthenticated.useQuery().data;
  // const signedURLData = trpc.recipes.getSignedURL.useMutation();
  const signedURLData = trpc.recipes.getSignedURL.useMutation();

  const [fetchingSignedURL, setFetchingSignedURL] = React.useState(false);

  const [openFileSelector, { filesContent, loading, errors, clear }] =
    useFilePicker({
      readAs: 'DataURL',
      accept: 'image/*',
      multiple: false,
      limitFilesConfig: { max: 2 },
      // minFileSize: 1,
      maxFileSize: 5, // in megabytes
    });

  useEffect(() => {
    rtx.resetMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFile = useCallback(
    async (signedURL: string) => {
      if (!signedURL) {
        log().Error(new Error(), 'signedURL is undefined');
        alert('unexpected error. invalid signed url');
        return;
      }

      const file = filesContent[0];
      const ct = getContentTypeFromFileExt(file.name);
      if (!ct) {
        log().Error(new Error(), 'invalid content type: ' + file.name);
        alert('unexpected error. failed to get content type');
        return;
      }

      // https://stackoverflow.com/questions/59836220/how-to-get-the-equivalent-data-format-of-curl-t-upload-data-option-from-inpu
      const r = await fetch(file.content);
      const blob = await r.blob();
      const buf = await blob.arrayBuffer();

      fetch(signedURL, {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': ct }),
        body: buf,
      }).then((r) => {
        // todo: UX user feedback
        log().Debug(new Error(), 'uploaded: ' + JSON.stringify(r));
      });
    },
    [filesContent]
  );

  useEffect(() => {
    const { isLoading, isError, isSuccess, data } = signedURLData;

    if (isLoading || !fetchingSignedURL) {
      return;
    }

    setFetchingSignedURL(false);

    if (isError || !data?.signedURL || !isSuccess) {
      alert('unexpected error. failed to get signed url');
      return;
    }

    uploadFile(data.signedURL);
  }, [signedURLData, fetchingSignedURL, uploadFile]);

  // async function putMedia(file: FileContent) {}

  function getContentTypeFromFileExt(filename: string): string | undefined {
    var ext = filename.split('.').pop() || '';
    if (ext == 'png') {
      return 'image/png';
    } else if (['jpeg', 'jpg'].includes(ext)) {
      return 'image/jpeg';
    } else {
      console.error('invalid file type');
    }
    return undefined;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    return <div>Error...</div>;
  }

  async function handleUploadMedia() {
    if (!filesContent || filesContent.length != 1) {
      return;
    }
    const filename = filesContent[0].name;
    const ct = getContentTypeFromFileExt(filename);
    if (!ct) {
      alert('invalid file type!');
      return;
    }
    setFetchingSignedURL(true);
    signedURLData.mutate({
      recipeID: rtx?.recipeId,
      payload: { filename: filename },
    });
  }

  function handleSelectMedia() {
    openFileSelector();
  }

  const isContributor =
    rtx?.recipe?.contributors &&
    rtx?.recipe?.contributors.map((c) => c.id).includes(user?.id);

  function SelectMediaButton() {
    return (
      <Button
        variant="text"
        onClick={handleSelectMedia}
        sx={{ paddingBottom: 2 }}
      >
        Select Image to Upload
      </Button>
    );
  }

  function UploadMediaButton() {
    return (
      <Button
        variant="text"
        onClick={handleUploadMedia}
        sx={{ paddingBottom: 2 }}
      >
        Upload Image
      </Button>
    );
  }

  function newMediaControls() {
    if (!isContributor) {
      return <>Fork to upload image</>;
    }

    return (
      <>
        {filesContent.length == 0 ? (
          <SelectMediaButton />
        ) : (
          <UploadMediaButton />
        )}

        {filesContent.map((file, index) => {
          return (
            <Grid
              key={index}
              xs
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Badge
                onClick={() => clear()}
                color="primary"
                badgeContent={<CloseIcon />}
              >
                <Box
                  component="img"
                  sx={{
                    // height: 256,
                    width: 384,
                    // maxHeight: { xs: 256, md: 256 },
                    maxWidth: { xs: 384, md: 384 },
                    borderStyle: 'solid',
                    border: '2px solid rgb(0, 120, 212)',
                    marginBottom: 2,
                  }}
                  alt={file.name}
                  src={file.content}
                />
              </Badge>
            </Grid>
          );
        })}
      </>
    );
  }

  return (
    <>
      {!!user?.id ? newMediaControls() : <>Login to upload images</>}
      <Grid container spacing={1}>
        {rtx.media.map((m) => (
          <RecipeMediaViewImage key={m.id} media={m} />
        ))}
      </Grid>
    </>
  );
}
