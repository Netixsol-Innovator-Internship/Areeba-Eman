import React from "react";
import { CiMug1 } from "react-icons/ci";
const SteepingInstructions = ({ steepingInstructions }) => {
  return (
    <div className="lg:w-[344px] lg:h-[249px] flex flex-col gap-6 justify-between">
      <h3 className="text-[#282828] md:text-[32px] text-2xl leading-7  font-montserrat">
        Steeping instructions
      </h3>
      <ul className="w-fit">
        {steepingInstructions?.servingSize.length > 0 && (
         <>
          <li className="py-2 flex items-center gap-2">
            <CiMug1 className="w-6 h-6" />
            <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
              <span className="sm:text-base text-sm font-normal ">
                SERVING SIZE:{" "}
              </span>
              {steepingInstructions?.servingSize[0]}
            </p>
          </li>
          <div className="sm:ml-12 ml-5 max-w-[264px] border border-[#A0A0A0]"></div>
         </>
        )}

        
        {steepingInstructions?.temperature.length > 0 && (
          <>
            <li className="py-2 flex items-center gap-2">
              <CiMug1 className="w-6 h-6" />
              <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
                <span className="sm:text-base text-sm font-normal ">
                  WATER TEMPERATURE:{" "}
                </span>
                {steepingInstructions?.temperature[0]}
              </p>
            </li>
            <div className="sm:ml-12 ml-5 max-w-[264px] border border-[#A0A0A0]"></div>
          </>
        )}

         {steepingInstructions?.time.length > 0 && (
         <>
          <li className="py-2 flex items-center gap-2">
            <CiMug1 className="w-6 h-6" />
            <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
              <span className="sm:text-base text-sm font-normal ">
                STEEPING TIME:{" "}
              </span>
              {steepingInstructions?.time[0]}
            </p>
          </li>
          <div className="sm:ml-12 ml-5 max-w-[264px] border border-[#A0A0A0]"></div>
         </>
        )}
  
         {steepingInstructions?.colorNote.length > 0 && (
         <>
          <li className="py-2 flex items-center gap-2">
            <CiMug1 className="w-6 h-6" />
            <p className="text-sm font-montserrat font-medium leading-5 text-wrap">
              <span className="sm:text-base text-sm font-normal ">
                COLOR:{" "}
              </span>
              {steepingInstructions?.colorNote[0]}
            </p>
          </li>
         
         </>
        )}
        
      </ul>
    </div>
  );
};

export default React.memo(SteepingInstructions);
