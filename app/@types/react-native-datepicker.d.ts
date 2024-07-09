declare module 'react-native-datepicker' {
    import React from 'react';
    import { StyleProp, ViewStyle, TextStyle } from 'react-native';
  
    export interface DatePickerProps {
      style?: StyleProp<ViewStyle>;
      date?: string | Date;
      mode?: 'date' | 'datetime' | 'time';
      format?: string;
      minDate?: string | Date;
      maxDate?: string | Date;
      confirmBtnText?: string;
      cancelBtnText?: string;
      iconSource?: any;
      hideText?: boolean;
      customStyles?: {
        dateIcon?: StyleProp<ViewStyle>;
        dateInput?: StyleProp<ViewStyle>;
        dateText?: StyleProp<TextStyle>;
        placeholderText?: StyleProp<TextStyle>;
        [key: string]: any;
      };
      minuteInterval?: number;
      timeZoneOffsetInMinutes?: number;
      showIcon?: boolean;
      disabled?: boolean;
      onDateChange: (date: string, dateObject?: Date) => void;
      placeholder?: string;
    }
  
    export default class DatePicker extends React.Component<DatePickerProps> {}
  }