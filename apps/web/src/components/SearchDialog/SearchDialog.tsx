import React from 'react';
import { useSearchContext } from '../../providers';
import { useNavigate } from 'react-router-dom';
import { useHits } from 'react-instantsearch-hooks-web';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import SearchBox from './SearchBox';

import { FormattedHits } from './CustomHits';
import { Hit } from './types';

export default function SearchDialog() {
  const navigate = useNavigate();
  const { open, handleClose } = useSearchContext();
  const { hits } = useHits();

  // todo: true for mobile
  const [fullScreen, setFullScreen] = React.useState(true);
  // else
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xl');

  function handleExploreClick() {
    handleClose();
    navigate('/r');
  }

  function hasTextMatch(hit: Hit) {
    return hit.prototype.hasOwnProperty.call('text_match');
  }

  function GenericHits() {
    if (hits.length === 0 || hasTextMatch(hits[0] as unknown as Hit)) {
      return null;
    }

    return FormattedHits(hits, 'Explore', handleClose);
  }

  function TitleHits() {
    const filteredHits = hits.filter(
      (h) =>
        hasTextMatch(h as unknown as Hit) &&
        (h as unknown as Hit)._highlightResult.name.matchedWords.length > 0
    );
    return FormattedHits(filteredHits.slice(0, 8), 'Recipes', handleClose);
  }

  function IngredientHits() {
    const filteredHits = hits.filter(
      (h) =>
        hasTextMatch(h as unknown as Hit) &&
        (h as unknown as Hit)._highlightResult.ingredients.find(
          (i) => i.matchLevel != 'none'
        )
    );
    return FormattedHits(filteredHits.slice(0, 8), 'Ingredients', handleClose);
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <SearchBox />
      </DialogTitle>
      <Divider />
      <Button onClick={handleExploreClick}>Explore</Button>

      <DialogContent>
        <GenericHits />
        <TitleHits />
        <IngredientHits />
      </DialogContent>
    </Dialog>
  );
}
