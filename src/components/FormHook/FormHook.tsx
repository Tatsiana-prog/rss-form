import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addFormData } from '../../store/formSlice';
import type { FormData } from '../../store/formSlice';
import styles from '../Modal/Modal.module.css';

interface Props {
  onClose: () => void;
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

const schema: yup.ObjectSchema<FormData> = yup.object({
  name: yup
    .string()
    .required('Введите имя')
    .matches(/^[A-ZА-Я]/, 'Имя должно начинаться с заглавной буквы'),
  age: yup
    .number()
    .typeError('Возраст должен быть числом')
    .positive('Возраст должен быть положительным')
    .integer('Возраст должен быть целым числом')
    .required('Введите возраст'),
  email: yup.string().email('Некорректный email').required('Введите email'),
  password: yup
    .string()
    .required('Введите пароль')
    .matches(
      passwordRegex,
      'Пароль должен содержать цифру, заглавную и строчную букву, спецсимвол'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
  gender: yup.string().required('Выберите пол'),
  agree: yup.boolean().oneOf([true], 'Необходимо согласие').required(),
  photo: yup.string().required('Загрузите фото'),
  country: yup.string().required('Выберите страну'),
});

const FormHook: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.form.countries);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = ['image/png', 'image/jpeg'].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;

    if (!isValidType || !isValidSize) {
      setPhotoError('Допустимы только .png и .jpeg, размер до 2MB');
      setValue('photo', '', { shouldValidate: true });
      setPhotoPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setValue('photo', base64, { shouldValidate: true });
      setPhotoPreview(base64);
      setPhotoError(null);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    dispatch(addFormData(data));
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Регистрация</h2>

      <div className={styles.field}>
        <label htmlFor="name">Имя:</label>
        <input id="name" {...register('name')} />
        {errors.name && (
          <span className={styles.error}>{errors.name.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="age">Возраст:</label>
        <input id="age" type="number" {...register('age')} />
        {errors.age && (
          <span className={styles.error}>{errors.age.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Пароль:</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword">Подтвердите пароль:</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="gender">Пол:</label>
        <select id="gender" {...register('gender')}>
          <option value="">Выберите</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
        {errors.gender && (
          <span className={styles.error}>{errors.gender.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="photo">Фото (.png, .jpeg):</label>
        <input
          id="photo"
          type="file"
          accept=".png,.jpeg,.jpg"
          onChange={handlePhotoUpload}
        />
        <input type="hidden" {...register('photo')} />
        {photoError && <span className={styles.error}>{photoError}</span>}
        {errors.photo && (
          <span className={styles.error}>{errors.photo.message}</span>
        )}
        {photoPreview && (
          <div className={styles.preview}>
            <img src={photoPreview} alt="Предпросмотр" width={120} />
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Страна:</label>
        <input id="country" list="country-list" {...register('country')} />
        <datalist id="country-list">
          {countries.map((c) => (
            <option key={c.code} value={c.name} />
          ))}
        </datalist>
        {errors.country && (
          <span className={styles.error}>{errors.country.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="agree">
          <input id="agree" type="checkbox" {...register('agree')} /> Я согласен
          с условиями
        </label>
        {errors.agree && (
          <span className={styles.error}>{errors.agree.message}</span>
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={!isValid}>
          Отправить
        </button>
        <button type="button" onClick={onClose}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default FormHook;
