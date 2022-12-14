import "./widget.scss";

const widget = ({ type }) => {
  let data;
  const amount = 100;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "see all users",
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "see all orders",
      };
      break;
    case "earning":
      data = {
        title: "EARNING",
        isMoney: true,
        link: "see all earning",
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,
        link: "see all balance",
      };
      break;
    default:
      break;
  }
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{amount}</span>
      </div>
    </div>
  );
};

export default widget;
