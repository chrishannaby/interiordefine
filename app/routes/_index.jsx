import {defer, json} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Content, fetchOneEntry} from '@builder.io/sdk-react';

const apiKey = '25b13b0802e6475f8d08239f389cd235';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  const urlPath = '/';

  const content = await fetchOneEntry({
    model: 'page',
    apiKey: apiKey,
    userAttributes: {
      urlPath,
    },
  });

  return json({content});
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <Content content={data.content} apiKey={apiKey} model="page" />
    </div>
  );
}
