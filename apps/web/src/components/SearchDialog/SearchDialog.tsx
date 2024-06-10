'use client';
import React, { useState } from 'react';
import { useSearchContext } from '@/providers/search-context';
import { useHits } from 'react-instantsearch';
import SearchDialogBox from './SearchDialogBox';
import { FormattedHits } from './CustomHits';
import { Hit } from './types';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

export default function SearchDialog() {
  const { open, handleClose } = useSearchContext();
  const { hits } = useHits();

  // tr@ck: true for mobile
  const [fullScreen, setFullScreen] = useState(true);
  // else
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xl');

  function GenericHits() {
    if (hits.length === 0 || hits[0].hasOwnProperty('text_match')) {
      return null;
    }

    return FormattedHits(hits, 'Search Results', handleClose);
  }

  function TitleHits() {
    const filteredHits = hits.filter(
      (h) =>
        h.hasOwnProperty('text_match') &&
        (h as unknown as Hit)._highlightResult.name.matchedWords.length > 0
    );
    return FormattedHits(filteredHits.slice(0, 8), 'Recipes', handleClose);
  }

  function IngredientHits() {
    const filteredHits = hits.filter(
      (h) =>
        h.hasOwnProperty('text_match') &&
        (h as unknown as Hit)._highlightResult.ingredients.find(
          (i) => i.matchLevel != 'none'
        )
    );
    return FormattedHits(filteredHits.slice(0, 8), 'Ingredients', handleClose);
  }

  return (
    <Dialog
      // sx={{ zIndex: 1100 }}
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <SearchDialogBox />
      </DialogTitle>
      <Divider />

      <DialogContent>
        <GenericHits />
        <TitleHits />
        <IngredientHits />
      </DialogContent>
    </Dialog>
  );
}
