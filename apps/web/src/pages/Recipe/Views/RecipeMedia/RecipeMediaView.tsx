import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { useFilePicker, FileContent } from 'use-file-picker';
import { useRecipeContext } from '../../../../providers';
import { useSessionContext } from '../../../../providers';
import { models_UserSummary } from '@4ks/api-fetch';
import { Image, ImageFit, ImageLoadState } from '@fluentui/react/lib/Image';
import { Stack } from '@fluentui/react/lib/Stack';
import { RecipeMediaViewImage } from './RecipeMediaViewImage';

export const RecipeMediaView = () => {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  useEffect(() => {
    rtx.resetMedia();
  }, []);

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
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
        contentType: ct,
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

  const isContributor = (rtx?.recipe.contributors as models_UserSummary[])
    .map((c) => c.id)
    .includes(ctx.user?.id);

  function SelectMediaButton() {
    return (
      <DefaultButton
        text="Select Image to Upload"
        onClick={handleSelectMedia}
        allowDisabledFocus
      />
    );
  }

  function UploadMediaButton() {
    return (
      <PrimaryButton
        text="Upload Image"
        onClick={handleUploadMedia}
        allowDisabledFocus
      />
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
                <div
                  key={index}
                  style={{
                    width: 256,
                    borderStyle: 'solid',
                    border: '2px solid rgb(0, 120, 212)',
                  }}
                >
                  <Image
                    src={file.content}
                    imageFit={ImageFit.cover}
                    alt={file.name}
                    width={256}
                    height={160}
                  />
                </div>
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
      <Stack horizontal wrap tokens={{ childrenGap: 30 }}>
        {rtx.media.map((m) => (
          <RecipeMediaViewImage key={m.id} media={m} />
        ))}
      </Stack>
    </>
  );
};
