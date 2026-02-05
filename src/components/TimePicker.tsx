import React, { type ReactElement } from 'react';

interface TimePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function TimePicker({
  id,
  value,
  onChange,
  disabled,
}: TimePickerProps): ReactElement {
  const timeStr = value && value.includes(':') ? value : '12:00';
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(3, 5);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${e.target.value}:${minutes}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${hours}:${e.target.value}`);
  };

  const hoursOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const minutesOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  return (
    <div className={`time-picker ${disabled ? 'time-picker--disabled' : ''}`}>
      <select
        id={id}
        value={hours}
        onChange={handleHourChange}
        disabled={disabled}
        className="time-picker__select"
        aria-label="Hours"
      >
        {hoursOptions.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="time-picker__separator">:</span>
      <select
        value={minutes}
        onChange={handleMinuteChange}
        disabled={disabled}
        className="time-picker__select"
        aria-label="Minutes"
      >
        {minutesOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimePicker;
