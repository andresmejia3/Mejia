export const AppColors = {
  // primaryColorString: '#2c3e50',
  // secondaryColorString: '#ffffff',

  // primaryColorString: '#bc3d3d',
  // primaryColorString: '#bc3d3d',
  primaryColorString: '#dd3d3d',
  secondaryColorString: '#ffffff',
};

AppColors.primaryColorHex = eval(`0x${AppColors.primaryColorString.slice(1)}`);
AppColors.secondaryColorHex = eval(`0x${AppColors.secondaryColorString.slice(1)}`);

export const EMPTY_FUNCTION = () => {};