import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useFilePicker } from 'use-file-picker';
import { useRecipeContext } from '../../../../providers/recipe-context';
import { useSessionContext } from '../../../../providers/session-context';
import { models_UserSummary } from '@4ks/api-fetch';
import { Image, IImageProps, ImageFit } from '@fluentui/react/lib/Image';

const RecipeMediaView = () => {
  const { isAuthenticated } = useAuth0();
  const ctx = useSessionContext();
  const rtx = useRecipeContext();

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: false,
    limitFilesConfig: { max: 2 },
    // minFileSize: 1,
    maxFileSize: 5, // in megabytes
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    return <div>Error...</div>;
  }

  function handleUploadMedia() {
    openFileSelector();
  }

  const isContributor = (rtx?.recipe.contributors as models_UserSummary[])
    .map((c) => c.id)
    .includes(ctx.user?.id);

  function uploadMediaButton() {
    if (isAuthenticated) {
      if (isContributor) {
        return (
          <DefaultButton
            text="Upload Image"
            onClick={handleUploadMedia}
            allowDisabledFocus
          />
        );
      } else {
        return <>Fork to upload image</>;
      }
    }
    return <>Login to upload images</>;
  }

  return (
    <>
      {uploadMediaButton()}
      {filesContent.map((file, index) => {
        const imageProps: Partial<IImageProps> = {
          imageFit: ImageFit.cover,
          src: file.content,
        };
        return (
          <div key={index}>
            <Image src={file.content} {...imageProps} alt={file.name} />
            <br />
          </div>
        );
      })}
    </>
  );
};

export { RecipeMediaView };
export default { RecipeMediaView };
