function BarChart({
  category1,
  category2,
  category3,
  percent1,
  percent2,
  percent3,
}: {
  category1: string;
  category2: string;
  category3: string;
  percent1: string;
  percent2: string;
  percent3: string;
}) {
  return (
    <table className={"w-full"}>
      <tbody className={""}>
        <tr className={""}>
          <td className={"w-[70px]"}>
            <div className="text-[14px] font-sans text-black-100">
              {category1}
            </div>
          </td>
          <td className={"w-full px-[20px]"}>
            <div className="w-full h-[5px] bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: percent1 }}
              ></div>
            </div>
          </td>
          <td
            className={
              "text-right text-nowrap text-[14px] font-sans text-black-100 min-w-[70px]"
            }
          >
            {percent1}
          </td>
        </tr>
        <tr className={""}>
          <td className={"min-w-[70px]"}>
            <div className="text-[14px] font-sans text-black-100 py-[8px]">
              {category2}
            </div>
          </td>
          <td className={"w-full px-[16px]"}>
            <div className="w-full h-[5px] bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: percent2 }}
              ></div>
            </div>
          </td>
          <td
            className={
              "text-[14px] text-nowrap font-sans text-right text-black-100 w-[70px]"
            }
          >
            {percent2}
          </td>
        </tr>
        <tr className={""}>
          <td className={""}>
            <div className="text-[14px] font-sans text-black-100 py-[8px]">
              {category3}
            </div>
          </td>
          <td className={"w-full px-[16px]"}>
            <div className="w-full h-[5px] bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: percent3 }}
              ></div>
            </div>
          </td>
          <td
            className={
              "text-[14px] text-nowrap font-sans text-right text-black-100"
            }
          >
            {percent3}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default BarChart;
