import React, { useEffect, useState } from 'react';
import './Tile.css';

interface TileProps {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  agree: boolean;
  photo: string;
  country: string;
  isNew?: boolean;
}

const Tile: React.FC<TileProps> = ({
  name,
  age,
  email,
  password,
  confirmPassword,
  gender,
  agree,
  photo,
  country,
  isNew = false,
}) => {
  const [highlight, setHighlight] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <div className={`tile ${highlight ? 'highlight' : ''}`}>
      <p>
        <strong>Имя:</strong> {name}
      </p>
      <p>
        <strong>Возраст:</strong> {age}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Пароль:</strong> {password}
      </p>
      <p>
        <strong>Подтверждение пароля:</strong> {confirmPassword}
      </p>
      <p>
        <strong>Пол:</strong> {gender}
      </p>
      <p>
        <strong>Согласие с условиями:</strong> {agree ? 'Да' : 'Нет'}
      </p>
      <p>
        <strong>Страна:</strong> {country}
      </p>
      {photo && (
        <div>
          <strong>Фото:</strong>
          <br />
          <img src={photo} alt="Фото пользователя" className="tile-photo" />
        </div>
      )}
    </div>
  );
};

export default Tile;
