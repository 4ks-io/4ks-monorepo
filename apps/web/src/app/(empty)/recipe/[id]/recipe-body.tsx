'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import RecipeMedia from './recipe-media';
import RecipeForks from './recipe-forks';
import RecipeVersions from './recipe-versions';
import RecipeSettings from './recipe-settings';
import RecipeContent from './recipe-content';
import { RecipeProps } from '@/types/recipe';

export default function RecipeBody(props: RecipeProps) {
  const pathname = usePathname();
  const [body, setBody] = React.useState<React.JSX.Element>();

  useEffect(() => {
    const path = pathname.split('/');
    // if (path.length == 3) {
    //   setBody(<RecipeContent {...props} />);
    // }
    // handle path
    const page = path[3] || '';
    switch (page) {
      case 'media':
        setBody(<RecipeMedia {...props} />);
        break;
      case 'forks':
        setBody(<RecipeForks {...props} />);
        break;
      case 'versions':
        setBody(<RecipeVersions {...props} />);
        break;
      case 'settings':
        setBody(<RecipeSettings {...props} />);
        break;
      default:
        setBody(<RecipeContent {...props} />);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return body;
}
