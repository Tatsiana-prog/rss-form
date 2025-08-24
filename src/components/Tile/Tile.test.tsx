import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import Tile from './Tile';

jest.useFakeTimers();

describe('Tile', () => {
  const mockProps = {
    name: 'Иван',
    age: 30,
    email: 'ivan@example.com',
    password: 'Aa1!aa',
    confirmPassword: 'Aa1!aa',
    gender: 'male',
    agree: true,
    photo: 'data:image/png;base64,test',
    country: 'Беларусь',
  };

  it('removes highlight class after 3 seconds', () => {
    const { container } = render(<Tile {...mockProps} isNew={true} />);
    const tileElement = container.firstChild as HTMLElement;

    expect(tileElement).toHaveClass('highlight');

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(tileElement).not.toHaveClass('highlight');
  });
});
