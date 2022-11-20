import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { useFilePicker, FileContent } from 'use-file-picker';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { useSessionContext } from '../../../../providers/session-context';
import { models_RecipeMedia, models_UserSummary } from '@4ks/api-fetch';
import { Image, ImageFit } from '@fluentui/react/lib/Image';

export const RecipeMediaView = () => {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [signedUrl, setSignedUrl] = useState('');
  const [medias, setMedias] = useState<models_RecipeMedia[]>([]);

  async function getMedia() {
    const medias = await ctx.api?.recipes.getRecipesMedia(
      `${rtx?.recipe?.root}`
    );
    setMedias(medias);
  }

  useEffect(() => {
    getMedia();
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

  useEffect(() => {
    if (filesContent && filesContent.length == 1) {
      const ct = getContentTypeFromFileExt(filesContent[0].name);
      if (!ct) {
        console.log('invalid file type');
        return;
      }
      ctx.api?.recipes
        .postRecipesMedia(`${rtx?.recipeId}`, {
          contentType: ct,
          filename: filesContent[0].name,
        })
        .then((r) => {
          setSignedUrl(r.signedUrl);
        });
    }
  }, [filesContent]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    return <div>Error...</div>;
  }

  async function putMedia(file: FileContent) {
    const ct = getContentTypeFromFileExt(file.name);
    if (!ct) {
      return;
    }

    // https://stackoverflow.com/questions/59836220/how-to-get-the-equivalent-data-format-of-curl-t-upload-data-option-from-inpu
    const r = await fetch(file.content);
    const blob = await r.blob();
    const buf = await blob.arrayBuffer();

    fetch(signedUrl, {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': ct }),
      body: buf,
    });
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

  function selectMediaButton() {
    return (
      <DefaultButton
        text="Select Image to Upload"
        onClick={handleSelectMedia}
        allowDisabledFocus
      />
    );
  }

  function uploadMediaButton() {
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
            {filesContent.length == 0
              ? selectMediaButton()
              : uploadMediaButton()}

            {filesContent.map((file, index) => {
              return (
                <Image
                  key={index}
                  src={file.content}
                  imageFit={ImageFit.cover}
                  alt={file.name}
                />
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
      {medias.map((m) => (
        <Image
          key={m.id}
          src={m.uri}
          imageFit={ImageFit.cover}
          alt={m.filename}
        />
      ))}
    </>
  );
};
