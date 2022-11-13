import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { useFilePicker, FileContent } from 'use-file-picker';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { useSessionContext } from '../../../../providers/session-context';
import { models_UserSummary, dtos_NewMedia } from '@4ks/api-fetch';
import { Image, ImageFit } from '@fluentui/react/lib/Image';

const RecipeMediaView = () => {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [signedUrl, setSignedUrl] = useState('');

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: false,
    limitFilesConfig: { max: 2 },
    // minFileSize: 1,
    maxFileSize: 5, // in megabytes
  });

  useEffect(() => {
    // todo : multiple images
    if (filesContent && filesContent.length == 1) {
      ctx.api?.media
        .postMediaToken({
          contentType: 'image/jpeg',
          filename: filesContent[0].name,
        })
        .then((url) => {
          setSignedUrl(url);
          console.log(url);
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
    // const formData = new FormData();
    // formData.append('file', file.content);

    var ext = file.name.split('.').pop() || '';
    let ct = null;
    if (ext == 'png') {
      ct = 'image/png';
    } else if (['jpeg', 'jpg'].includes(ext)) {
      ct = 'image/jpeg';
    } else {
      console.error('invalid file type');
      return;
    }

    const options: RequestInit = {
      method: 'PUT',
      // headers: new Headers({ 'Content-Type': ct }),
      redirect: 'follow',
      body: file.content,
    };

    let response = await fetch(signedUrl, options);
    let result = await response.json();
    console.log(result);
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
        text="Select Image"
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

  return <>{newMediaControls()}</>;
};

export { RecipeMediaView };
export default { RecipeMediaView };
