import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, endpoints } from 'src/utils/axios';
import { product_details } from './product_details';

// SWR options to avoid unnecessary revalidations
const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

/**
 * Hook to get all products
 */
export function useGetProducts() {
  const url = 'https://api-prod-minimal-v610.pages.dev/api/product/list';

  // Fetch data using SWR
  const { data, error, isValidating } = useSWR(url, fetcher, swrOptions);

  // Memoize the returned values for better performance
  const memoizedValue = useMemo(() => ({
    products: data?.products || [],
    productsLoading: !data && !error, // Check loading state
    productsError: error,
    productsValidating: isValidating,
    productsEmpty: !error && !data?.products?.length,
  }), [data?.products, error, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * Hook to get a single product by its ID
 */
export function useGetProduct(productId) {
  // Find the product by matching the productId with product_details
  const product = product_details?.product?.id === productId ? product_details?.product : false;

  // Memoize the result to improve performance and avoid unnecessary recalculations
  const memoizedValue = useMemo(() => ({
    product,                     // The product data, or null if not found
    productLoading: !product,     // Consider it loading if the product doesn't exist yet
    productError: !product,       // If product isn't found, treat it as an error
    productValidating: !!product, // If product is found, assume it's in a validating state
  }), [product, productId]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

/**
 * Hook to search for products by a query
 */
export function useSearchProducts(query) {
  // Only call API if there is a query, otherwise pass an empty string to SWR
  const url = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true, // Retain previous data while new data is being fetched
  });

  // Memoize the returned values for better performance
  const memoizedValue = useMemo(() => ({
    searchResults: data?.results || [],
    searchLoading: !data && !error,
    searchError: error,
    searchValidating: isValidating,
    searchEmpty: !error && !data?.results?.length,
  }), [data?.results, error, isValidating]);

  return memoizedValue;
}
