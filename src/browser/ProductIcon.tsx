import {PRODUCT_ICON} from "./productConstants";

const ProductIcon = () => {
  return <img src={PRODUCT_ICON} style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'top center'}} alt="product icon" />;
}

export default ProductIcon;
