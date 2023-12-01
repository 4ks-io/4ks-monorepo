import Link from 'next/link';
import Typography from '@mui/material/Typography';

export default function UsernameSpecification() {
  return (
    <Typography variant="body1" component="h2">
      <ul>
        <li>Username must be minimum 8 and maximum 24 characters.</li>
        <li>
          It may only contain alphanumeric characters or non-consecutive
          hyphens.
        </li>
        <li>It cannot begin or end with a hyphen.</li>
        <li>
          It cannot be a{' '}
          <Link href="/reserved-words" passHref>
            reserved word
          </Link>
          .
        </li>
      </ul>
    </Typography>
  );

  // return (
  // <Typography component={'span'} variant={'body2'}>
  //   <ul>
  //     <li>Min length: 8 characters.</li>
  //     <li>Max length: 24 characters.</li>
  //     <li>Characters must be either a hyphen ( - ) or alphanumeric.</li>
  //     <li>Cannot start or end with a hyphen.</li>
  //     <li>Cannot include consecutive hyphens.</li>
  //     <li>Cannot be a reserved word.</li>
  //     <li>Must be globally unique.</li>
  //   </ul>
  // );
}
