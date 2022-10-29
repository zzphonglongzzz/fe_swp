const getOptionWithIdandName = (listData) => {
  return listData.map((data) => {
    return {
      value: data.id,
      label: data.name,
    };
  });
};
const getSelectedOption = (array, value) => {
  const arrayOption = getOptionWithIdandName(array);
  if (value !== null) {
    return arrayOption.find((item) => item.value == value);
  } else {
    return null;
  }
};
const removeExtraSpace = (s) => s.trim().split(/ +/).join(" ");
const FormatDataUtils = {
  getOptionWithIdandName,
  getSelectedOption,
  removeExtraSpace
};
export default FormatDataUtils;
