const InfoBlock = ({ label, value }: any) => (
  <div>
    <p className="text-yellow-400 text-sm mb-1">{label}</p>
    <p className="text-gray-300 break-words">{value}</p>
  </div>
);
export default InfoBlock;
