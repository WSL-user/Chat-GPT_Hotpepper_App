export const situations = [
    { value: '宴会', label: '宴会' ,color: "primary25" , key:'1'},
    { value: 'デート', label: 'デート' ,color: "primary25", key:'2'},
    { value: '家族', label: '家族' ,color: "primary25", key:'3'},
];
  
export const others = [
    { value: '無料Wi-Fi', label: '無料Wi-Fi' ,color: "green", key:'4'},
    { value: 'バリアフリー', label: 'バリアフリー' ,color: "green", key:'5'},
    { value: '駐車場有り', label: '駐車場有り' ,color: "green", key:'6'},
];


export const groupedOptions = [
  {
    label: 'シチュエーション',
    options: situations,
  },
  {
    label: 'オプション',
    options: others,
  },
];