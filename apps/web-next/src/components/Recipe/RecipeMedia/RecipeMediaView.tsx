import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useFilePicker, FileContent } from 'use-file-picker';
import { useRecipeContext } from '@/providers/recipe-context';
import { models_UserSummary } from '@4ks/api-fetch';
import { RecipeMediaViewImage } from './RecipeMediaViewImage';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';

export const RecipeMediaView = () => {
  const { isAuthenticated } = useAuth0();
  const rtx = useRecipeContext();

  useEffect(() => {
    rtx.resetMedia();
  }, []);

  const [openFileSelector, { filesContent, loading, errors, clear }] =
    useFilePicker({
      readAs: 'DataURL',
      accept: 'image/*',
      multiple: false,
      limitFilesConfig: { max: 2 },
      // minFileSize: 1,
      maxFileSize: 5, // in megabytes
    });

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

  async function putMedia(file: FileContent) {
    if (filesContent && filesContent.length == 1) {
      const ct = getContentTypeFromFileExt(filesContent[0].name);
      if (!ct) {
        alert('invalid file type!');
        return;
      }
      const m = await ctx.api?.recipes.postRecipesMedia(`${rtx?.recipeId}`, {
        // contentType: ct,
        filename: filesContent[0].name,
      });

      if (!m?.signedUrl) {
        alert('unexpected error. reload image');
      }

      // https://stackoverflow.com/questions/59836220/how-to-get-the-equivalent-data-format-of-curl-t-upload-data-option-from-inpu
      const r = await fetch(file.content);
      const blob = await r.blob();
      const buf = await blob.arrayBuffer();

      if (m?.signedUrl) {
        fetch(m.signedUrl, {
          method: 'PUT',
          headers: new Headers({ 'Content-Type': ct }),
          body: buf,
        });
      }
    }
  }

  function handleUploadMedia() {
    putMedia(filesContent[0]);
  }

  function handleSelectMedia() {
    openFileSelector();
  }

  const isContributor =
    rtx?.recipe?.contributors &&
    (rtx?.recipe?.contributors as models_UserSummary[])
      .map((c) => c.id)
      .includes(ctx.user?.id);

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
    if (isAuthenticated) {
      if (isContributor) {
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
      } else {
        return <>Fork to upload image</>;
      }
    }
    return <>Login to upload images</>;
  }

  return (
    <>
      {newMediaControls()}
      <Grid container spacing={1}>
        {rtx.media.map((m) => (
          <RecipeMediaViewImage key={m.id} media={m} />
        ))}
      </Grid>
    </>
  );
};
