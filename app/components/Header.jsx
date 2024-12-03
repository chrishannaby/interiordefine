import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <header className="flex flex-col px-8 pt-6 divide-y-1 divide-gray-200">
      <div className="flex justify-between items-center pb-4">
        <NavLink prefetch="intent" to="/" end>
          <svg width="265.5" height="16" aria-hidden="true">
            <use href="#svg-logo"></use>
            <symbol id="svg-logo" viewBox="0 0 265.5 16">
              <polygon
                fill="currentColor"
                points="0,15.7 2.7,15.7 2.7,0.3 0,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="22,0.3 22,11 13.7,0.3 11.2,0.3 11.2,15.7 13.9,15.7 13.9,4.8 22.4,15.7 24.7,15.7 24.7,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="31.8,0.3 31.8,2.8 36.7,2.8 36.7,15.7 39.4,15.7 39.4,2.8 44.3,2.8 44.3,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="51.6,0.3 51.6,15.7 63.1,15.7 63.1,13.3 54.3,13.3 54.3,9.2 62,9.2 62,6.7 54.3,6.7 54.3,2.7 63,2.7 63,0.3"
              ></polygon>
              <path
                fill="currentColor"
                d="M77.4,2.8h-3.9V8h4c1.9,0,3.2-1,3.2-2.6C80.6,3.7,79.4,2.8,77.4,2.8z M80.6,15.7l-3.8-5.4h-3.4 v5.4h-2.7V0.3h6.9c3.6,0,5.7,1.9,5.7,4.9c0,2.6-1.5,4.1-3.7,4.7l4.2,5.8H80.6z"
              ></path>
              <polygon
                fill="currentColor"
                points="91.2,15.7 93.9,15.7 93.9,0.3 91.2,0.3"
              ></polygon>
              <path
                fill="currentColor"
                d="M109.8,2.5c-3.1,0-5.2,2.4-5.2,5.5c0,3,2.2,5.5,5.2,5.5S115,11.1,115,8 C115.1,5,112.9,2.5,109.8,2.5 M109.8,16c-4.7,0-8-3.6-8-8s3.3-8,8.1-8c4.7,0,8,3.6,8,8C117.9,12.4,114.6,16,109.8,16"
              ></path>
              <path
                fill="currentColor"
                d="M131.9,2.8H128V8h4c1.9,0,3.2-1,3.2-2.6C135,3.7,133.9,2.8,131.9,2.8z M135.1,15.7l-3.8-5.4h-3.4 v5.4h-2.7V0.3h6.9c3.5,0,5.7,1.9,5.7,4.9c0,2.6-1.5,4.1-3.7,4.7l4.2,5.8H135.1z"
              ></path>
              <path
                fill="currentColor"
                d="M167.2,2.8h-3v10.5h3c3.2,0,5.4-2.2,5.4-5.2C172.6,5,170.5,2.8,167.2,2.8 M167.2,15.7h-5.7V0.3 h5.7c4.8,0,8.2,3.3,8.2,7.7C175.4,12.4,172.1,15.7,167.2,15.7"
              ></path>
              <polygon
                fill="currentColor"
                points="182.7,0.3 182.7,15.7 194.3,15.7 194.3,13.3 185.5,13.3 185.5,9.2 193.2,9.2 193.2,6.7 185.5,6.7 185.5,2.7 194.2,2.7 194.2,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="201.9,0.3 201.9,15.7 204.6,15.7 204.6,9.5 212.4,9.5 212.4,7 204.6,7 204.6,2.8 213.4,2.8 213.4,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="220.9,15.7 223.6,15.7 223.6,0.3 220.9,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="242.9,0.3 242.9,11 234.7,0.3 232.1,0.3 232.1,15.7 234.8,15.7 234.8,4.8 243.3,15.7 245.6,15.7 245.6,0.3"
              ></polygon>
              <polygon
                fill="currentColor"
                points="253.9,0.3 253.9,15.7 265.5,15.7 265.5,13.3 256.6,13.3 256.6,9.2 264.4,9.2 264.4,6.7 256.6,6.7 256.6,2.7 265.4,2.7 265.4,0.3"
              ></polygon>
            </symbol>
          </svg>
        </NavLink>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {menu.items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <SearchToggle />
      <NavLink to="/account">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="text-gray-600 relative"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>{' '}
      {count === null ? (
        <span>&nbsp;</span>
      ) : (
        <span className="absolute top-[-10px] right-[-10px] bg-[#77774A] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {count}
        </span>
      )}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
