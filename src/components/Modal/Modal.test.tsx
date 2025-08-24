import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(
      <Modal onClose={mockOnClose}>
        <div>Контент модального окна</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the modal', () => {
    render(
      <Modal onClose={mockOnClose}>
        <div>Контент модального окна</div>
      </Modal>
    );

    fireEvent.mouseDown(document);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside the modal', () => {
    render(
      <Modal onClose={mockOnClose}>
        <div data-testid="modal-content">Контент модального окна</div>
      </Modal>
    );

    const modalContent = screen.getByTestId('modal-content');
    fireEvent.mouseDown(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
