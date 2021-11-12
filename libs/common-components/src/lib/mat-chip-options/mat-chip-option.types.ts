export interface ChipOption {
  value: string;
  text: string;
}

export interface GroupedChipOptions {
  options: ChipOption[];
  multiple?: boolean;
}

export type ChipOptions = string[] | (ChipOption | GroupedChipOptions)[];

const options: ChipOptions = ['test'];
const option2s: ChipOptions = [
  {
    text: 'tst',
    value: 'test',
  },
];

const option23s: ChipOptions = [
  {
    text: 'tst',
    value: 'test',
  },
  {
    options: [
      {
        text: 'tst',
        value: 'test',
      },
    ],
  },
];
