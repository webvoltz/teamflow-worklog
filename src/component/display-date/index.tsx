import dayjs from 'dayjs';

const DisplayDate = () => {
  return (
    <h2 className=" text-lg font-bold text-text-color md:text-2xl">
      Today ({dayjs().format('DD MMM, YYYY')})
    </h2>
  );
};

export default DisplayDate;
