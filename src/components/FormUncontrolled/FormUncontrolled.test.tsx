import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FormUncontrolled from './FormUncontrolled';
import type { RootState } from '../../store/store';

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: (state: RootState) => unknown) =>
    selector({
      form: {
        countries: [{ code: 'BY', name: 'Беларусь' }],
      },
    } as RootState),
}));

describe('FormUncontrolled', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('успешно отправляет форму и вызывает onClose', async () => {
    render(<FormUncontrolled onClose={mockOnClose} />);

    const nameInput = (await screen.findByLabelText(
      'Имя:'
    )) as HTMLInputElement;
    const ageInput = (await screen.findByLabelText(
      'Возраст:'
    )) as HTMLInputElement;
    const emailInput = (await screen.findByLabelText(
      'Email:'
    )) as HTMLInputElement;
    const passwordInput = (await screen.findByLabelText(
      'Пароль:'
    )) as HTMLInputElement;
    const confirmPasswordInput = (await screen.findByLabelText(
      'Подтвердите пароль:'
    )) as HTMLInputElement;
    const genderSelect = (await screen.findByLabelText(
      'Пол:'
    )) as HTMLSelectElement;
    const countryInput = (await screen.findByLabelText(
      'Страна:'
    )) as HTMLInputElement;
    const agreeCheckbox = (await screen.findByLabelText(
      /Я согласен с условиями/i
    )) as HTMLInputElement;
    const photoInput = (await screen.findByLabelText(
      /Фото/i
    )) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Иван' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Aa1!aa' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Aa1!aa' } });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.change(countryInput, { target: { value: 'Беларусь' } });
    fireEvent.click(agreeCheckbox);

    Object.defineProperty(global, 'FileReader', {
      writable: true,
      value: class {
        onloadend: () => void = () => {};
        readAsDataURL() {
          this.onloadend();
        }
        result = 'data:image/png;base64,test';
      },
    });

    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    fireEvent.change(photoInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Отправить'));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
