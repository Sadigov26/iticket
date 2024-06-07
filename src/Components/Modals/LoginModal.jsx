/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Icon from 'react-icons-kit';
import {x} from 'react-icons-kit/feather/x'
import {google} from 'react-icons-kit/icomoon/google'
import {facebook} from 'react-icons-kit/icomoon/facebook'
import translations from "../translations.json"

const LoginModal = ({ show, onHide,language }) => {

  const handleClose = () => {
    onHide();
  };

  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={onHide} keyboard={false} centered onClick={handleBackdropClick} className='modal-login w-full h-screen flex justify-center items-center'>
      <div className='modal-content relative bg-white items-center min-w-96'>
        <span className='hat'></span>
        <button className='absolute top-0 -right-10 sm:block hidden' onClick={handleClose}>
          <Icon  className='text-white' icon={x} size={35}/>
        </button>
      <div className='modal-body relative p-9 w-full bg-yellow border-0'>
 <div className='modal-head flex justify-between items-center bg-transparent pb-6 '>
  <h4 className='modal-title z-10 lg:text-3xl text-2xl'>{translations[language]['login']}</h4>
  <div className='modal-addons flex flex-nowrap items-center'>
    <button className='facebook rounded-full '>
      <Icon className='icon text-white' icon={facebook} size={22}/>
    </button>
    <button className='google rounded-full'>
      <Icon className='icon text-white' icon={google} size={19}/>
    </button>
  </div>
 </div>
 <form>
<div className="form-group mb-5">
<input className='sm:py-4 sm:px-6 py-2 px-3' type="text" name="login" id="login-email" placeholder="E-poçt"/>
</div>
<div className="form-group mb-5">
<input type="text" name="login" id="login-email" placeholder="Şifrə"/>
</div>
<div className="form-group mb-5">
<button className='orange'><p className='font-bold'>Daxil ol</p> <a href='#!' className='forgot'>Unutmusunuz?</a></button>
</div>
 </form>
 <div className="modal-footer flex items-center justify-center gap-2">
     <p className='sm:text-lg'> iTicket.AZ-da yenisiniz?</p>
      <a className='text-gray-400 sm:text-lg' href="!#">
        Qeydiyyatdan keçin
      </a></div>
      </div>
      </div>
    </Modal>
  );
};

export default LoginModal;