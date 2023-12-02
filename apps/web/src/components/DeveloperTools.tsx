'use client';
import React, { useState } from 'react';
import Button from '@mui/material/Button';

type DeveloperToolsProps = {
  t: string;
};

export default function DeveloperTools({ t }: DeveloperToolsProps) {
  const [content, setContent] = useState('');

  function handleClick() {
    if (content != '') {
      setContent('');
      return;
    }
    setContent(t);
  }

  return (
    <>
      <Button onClick={handleClick}></Button>
      <p>{content}</p>
    </>
  );
}
