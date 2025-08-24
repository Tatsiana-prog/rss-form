import { useState } from 'react';
import Modal from './components/Modal/Modal';
import FormUncontrolled from './components/FormUncontrolled/FormUncontrolled';
import FormHook from './components/FormHook/FormHook';
import Tile from './components/Tile/Tile';
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import type { FormData } from './store/formSlice';
import './App.css';

type ModalType = 'uncontrolled' | 'hook' | null;

function App() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const formData = useSelector((state: RootState) => state.form.data);

  return (
    <div>
      <h1>Формы регистрации</h1>
      <button onClick={() => setModalType('uncontrolled')}>
        Открыть Uncontrolled форму
      </button>
      <button onClick={() => setModalType('hook')}>
        Открыть React Hook Form
      </button>

      {modalType && (
        <Modal onClose={() => setModalType(null)}>
          {modalType === 'uncontrolled' ? (
            <FormUncontrolled onClose={() => setModalType(null)} />
          ) : (
            <FormHook onClose={() => setModalType(null)} />
          )}
        </Modal>
      )}

      <div className="tiles">
        {formData.map((data: FormData, index: number) => (
          <Tile
            key={index}
            name={data.name}
            age={data.age}
            email={data.email}
            password={data.password}
            confirmPassword={data.confirmPassword}
            gender={data.gender}
            agree={data.agree}
            photo={data.photo}
            country={data.country}
            isNew={index === formData.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
