import { InputValuesTs } from './InputValues';

export interface NormalFieldProps {
  inputValues: InputValuesTs;
  setInputValue: React.Dispatch<React.SetStateAction<InputValuesTs>>;
  className?: string;
  category: 'nrf';
}
