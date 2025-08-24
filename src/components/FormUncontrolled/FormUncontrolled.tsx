import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFormData } from '../../store/formSlice';
import styles from '../Modal/Modal.module.css';

interface Props {
  onClose: () => void;
}

const FormUncontrolled: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.form.countries);

  const refs = {
    name: useRef<HTMLInputElement>(null),
    age: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
    gender: useRef<HTMLSelectElement>(null),
    agree: useRef<HTMLInputElement>(null),
    country: useRef<HTMLInputElement>(null),
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoBase64, setPhotoBase64] = useState<string>('');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const name = refs.name.current?.value?.trim() ?? '';
    const age = Number(refs.age.current?.value ?? 0);
    const email = refs.email.current?.value?.trim() ?? '';
    const password = refs.password.current?.value ?? '';
    const confirmPassword = refs.confirmPassword.current?.value ?? '';
    const gender = refs.gender.current?.value ?? '';
    const country = refs.country.current?.value ?? '';
    const agree = refs.agree.current?.checked ?? false;

    if (!name || !/^[A-ZА-Я]/.test(name)) {
      newErrors.name = 'Имя должно начинаться с заглавной буквы';
    }
    if (!age || age <= 0) {
      newErrors.age = 'Возраст должен быть положительным числом';
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Некорректный email';
    }
    if (
      !password ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}/.test(password)
    ) {
      newErrors.password =
        'Пароль должен содержать цифру, заглавную и строчную букву, спецсимвол';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Пароли должны совпадать';
    }
    if (!gender) {
      newErrors.gender = 'Выберите пол';
    }
    if (!country) {
      newErrors.country = 'Выберите страну';
    }
    if (!agree) {
      newErrors.agree = 'Необходимо согласие';
    }
    if (!photoBase64) {
      newErrors.photo = 'Загрузите фото';
    }

    return newErrors;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = ['image/png', 'image/jpeg'].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;

    if (!isValidType || !isValidSize) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Допустимы только .png и .jpeg, размер до 2MB',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setPhotoBase64(result);
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated.photo;
          return updated;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      addFormData({
        name: refs.name.current?.value?.trim() ?? '',
        age: Number(refs.age.current?.value ?? 0),
        email: refs.email.current?.value?.trim() ?? '',
        password: refs.password.current?.value ?? '',
        confirmPassword: refs.confirmPassword.current?.value ?? '',
        gender: refs.gender.current?.value ?? '',
        agree: refs.agree.current?.checked ?? false,
        photo: photoBase64,
        country: refs.country.current?.value ?? '',
      })
    );

    onClose();
  };

  const renderField = (
    id: string,
    label: string,
    input: React.ReactNode,
    error?: string
  ) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {input}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {renderField(
        'name',
        'Имя:',
        <input id="name" type="text" ref={refs.name} />,
        errors.name
      )}
      {renderField(
        'age',
        'Возраст:',
        <input id="age" type="number" ref={refs.age} />,
        errors.age
      )}
      {renderField(
        'email',
        'Email:',
        <input id="email" type="email" ref={refs.email} />,
        errors.email
      )}
      {renderField(
        'password',
        'Пароль:',
        <input id="password" type="password" ref={refs.password} />,
        errors.password
      )}
      {renderField(
        'confirmPassword',
        'Подтвердите пароль:',
        <input
          id="confirmPassword"
          type="password"
          ref={refs.confirmPassword}
        />,
        errors.confirmPassword
      )}
      {renderField(
        'gender',
        'Пол:',
        <select id="gender" ref={refs.gender}>
          <option value="">Выберите</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>,
        errors.gender
      )}
      {renderField(
        'photo',
        'Фото (.png, .jpeg):',
        <input
          id="photo"
          type="file"
          accept=".png,.jpeg,.jpg"
          onChange={handlePhotoUpload}
        />,
        errors.photo
      )}
      {renderField(
        'country',
        'Страна:',
        <>
          <input id="country" list="country-list" ref={refs.country} />
          <datalist id="country-list">
            {countries.map((c) => (
              <option key={c.code} value={c.name} />
            ))}
          </datalist>
        </>,
        errors.country
      )}
      <div className={styles.field}>
        <div>
          <label htmlFor="agree">
            <input id="agree" type="checkbox" ref={refs.agree} />Я согласен с
            условиями
          </label>
        </div>
        {errors.agree && <span className={styles.error}>{errors.agree}</span>}
      </div>
      <div className={styles.actions}>
        <button type="submit">Отправить</button>
        <button type="button" onClick={onClose}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default FormUncontrolled;
