import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';

function BreadCrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
      <Breadcrumb.Item active>
        <Link to="/shop">Shop</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadCrumb;