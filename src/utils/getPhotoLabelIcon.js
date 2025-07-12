export const getPhotoLabelIcon = (name, photoURL) => {
  const iconDiv = document.createElement('div');
  iconDiv.style.display = 'flex';
  iconDiv.style.alignItems = 'center';
  iconDiv.style.background = '#fff';
  iconDiv.style.border = '1px solid #ccc';
  iconDiv.style.borderRadius = '50%';
  iconDiv.style.padding = '1px 1px';

  const img = document.createElement('img');
  img.src = photoURL;
  img.style.width = '24px';
  img.style.height = '24px';
  img.style.borderRadius = '50%';

  iconDiv.appendChild(img);

  return iconDiv;
};
