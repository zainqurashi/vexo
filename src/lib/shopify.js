/**
 * Vexo - Shopify Storefront API Client (GraphQL)
 * Version: 2024-01
 */

const SHOPIFY_DOMAIN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHOPIFY_STORE_DOMAIN) || '';
const SHOPIFY_TOKEN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN) || '';
const API_VERSION = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHOPIFY_API_VERSION) || '2024-01';

/**
 * Check if valid Shopify credentials are configured
 */
export function isShopifyConfigured() {
  return Boolean(
    SHOPIFY_DOMAIN &&
    SHOPIFY_TOKEN &&
    !SHOPIFY_TOKEN.includes('your_storefront_access_token')
  );
}

/**
 * Clean domain helper
 */
function getEndpoint() {
  const cleanDomain = SHOPIFY_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${cleanDomain}/api/${API_VERSION}/graphql.json`;
}

/**
 * Execute a Storefront GraphQL Query
 * @param {string} query
 * @param {object} variables
 */
export async function shopifyFetch({ query, variables = {} }) {
  if (!isShopifyConfigured()) {
    console.warn('[Vexo Shopify] Storefront credentials not configured. Using intentional initial state.');
    return null;
  }

  try {
    const response = await fetch(getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`Shopify API HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      console.error('[Vexo Shopify] GraphQL Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL Query Failed');
    }

    return json.data;
  } catch (error) {
    console.error('[Vexo Shopify Fetch Error]:', error);
    return null;
  }
}

/* ─── GRAPHQL QUERIES ─── */

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          availableForSale
          totalInventory
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          tags
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      totalInventory
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 8) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
      tags
    }
  }
`;

/* ─── CART MUTATIONS ─── */

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 20) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/* ─── PUBLIC API METHODS ─── */

/**
 * Fetch products from Shopify
 * @param {object} options
 * @returns {Promise<Array>}
 */
export async function getShopifyProducts({ first = 24, query = '' } = {}) {
  const data = await shopifyFetch({
    query: PRODUCTS_QUERY,
    variables: { first, query }
  });

  if (!data || !data.products || !data.products.edges) {
    return [];
  }

  return data.products.edges.map(edge => normalizeProduct(edge.node));
}

/**
 * Fetch single product by handle
 * @param {string} handle
 * @returns {Promise<object|null>}
 */
export async function getShopifyProductByHandle(handle) {
  const data = await shopifyFetch({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle }
  });

  if (!data || !data.product) {
    return null;
  }

  return normalizeProduct(data.product);
}

/**
 * Normalize Shopify GraphQL product node into standard frontend format
 */
function normalizeProduct(node) {
  const images = (node.images?.edges || []).map(e => e.node.url);
  const variants = (node.variants?.edges || []).map(e => ({
    id: e.node.id,
    title: e.node.title,
    price: parseFloat(e.node.price?.amount || 0),
    compareAtPrice: e.node.compareAtPrice?.amount ? parseFloat(e.node.compareAtPrice.amount) : null,
    availableForSale: e.node.availableForSale,
    quantityAvailable: e.node.quantityAvailable ?? null
  }));

  const primaryVariant = variants[0] || {};
  const price = primaryVariant.price || parseFloat(node.priceRange?.minVariantPrice?.amount || 0);
  const compareAtPrice = primaryVariant.compareAtPrice || 
    (node.compareAtPriceRange?.minVariantPrice?.amount ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) : null);

  // Extract custom benefit tag or category tag
  const tags = node.tags || [];
  const benefitTag = tags.find(t => t.startsWith('benefit:'))?.replace('benefit:', '') || 'Precision Engineered';
  const category = tags.find(t => ['kitchen', 'home', 'bar'].includes(t.toLowerCase())) || 'Smart Living';

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price,
    compareAtPrice,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'],
    variants,
    availableForSale: node.availableForSale,
    totalInventory: node.totalInventory,
    benefitTag,
    category,
    rating: 5.0,
    reviewCount: 48
  };
}

/**
 * Create a new Shopify Cart
 */
export async function createShopifyCartApi(lines = []) {
  const lineInputs = lines.map(item => ({
    merchandiseId: item.variantId || item.id,
    quantity: item.quantity
  }));

  const data = await shopifyFetch({
    query: CART_CREATE_MUTATION,
    variables: { input: { lines: lineInputs } }
  });

  return data?.cartCreate?.cart || null;
}
