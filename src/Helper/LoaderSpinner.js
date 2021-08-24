import Loader from 'react-loader-spinner';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './LoaderSpinner.css';

const LoaderSpinner = () => {
    return (
        <div className='loader-spinner'>
            <Loader
                type="ThreeDots"
                color="#ee4c74"
                height={80}
                width={80}
            />
        </div>
    )
}
export default LoaderSpinner;
