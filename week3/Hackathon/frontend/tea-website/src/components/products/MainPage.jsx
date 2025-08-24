import Sidebar from './Sidebar';
import ProductsGrid from './ProductsGrid';
import Container from '../shared/common/Container';
import { useState, useEffect } from 'react';
import { useGetProductsQuery } from '../../redux/slices/productApiSlice';

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const { data } = useGetProductsQuery({});
  const serverProducts = data?.data || [];

  useEffect(() => {
    if (!products?.length) {
      setProducts(serverProducts);
    }
  }, [serverProducts]);

  const handleProductsFiltered = (filtered) => {
    setProducts(filtered);
  };

  return (
    <div className='flex items-center justify-center py-6'>
      <Container>
        <div className='px-6 sm:px-10 lg:px-12 flex justify-between gap-20'>
          <Sidebar onProductsFiltered={handleProductsFiltered} />
          <ProductsGrid products={products} />
        </div>
      </Container>
    </div>
  );
};

export default MainPage;
