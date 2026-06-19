import { Link } from "react-router-dom";
import imgAdd from "../../assets/appointments/add.svg";
import imgAlert from "../../assets/appointments/alert.svg";
import imgAppsList from "../../assets/appointments/apps-list.svg";
import imgArrowExit from "../../assets/appointments/arrow-exit.svg";
import imgBounds from "../../assets/appointments/book-btn-bg.svg";
import imgBounds1 from "../../assets/appointments/tab-follow-ups.svg";
import imgBounds2 from "../../assets/appointments/search-bg.svg";
import imgBounds3 from "../../assets/appointments/filter-bg.svg";
import imgBounds4 from "../../assets/appointments/date-bg.svg";
import imgBriefcaseMedical from "../../assets/appointments/briefcase.svg";
import imgCalendar from "../../assets/appointments/calendar-icon.svg";
import imgCalendar1 from "../../assets/appointments/popup-calendar.svg";
import imgCalendarPerson from "../../assets/appointments/calendar-person.svg";
import imgChevron from "../../assets/appointments/chevron.svg";
import imgChevron1 from "../../assets/appointments/chevron1.svg";
import imgDataHistogram from "../../assets/appointments/histogram.svg";
import imgDoctor from "../../assets/appointments/doctor.svg";
import imgDocumentBulletList from "../../assets/appointments/document.svg";
import imgEllipse3704 from "../../assets/appointments/ellipse.svg";
import imgFrame from "../../assets/appointments/close.svg";
import imgFrame1 from "../../assets/appointments/book/chevron-select.svg";
import imgFrame2 from "../../assets/appointments/book/chevron-section.svg";
import imgFrame3 from "../../assets/appointments/book/calendar-field.svg";
import imgFrame4 from "../../assets/appointments/book/tag-close.svg";
import imgFrame5 from "../../assets/appointments/book/chevron-field.svg";
import imgGrid from "../../assets/appointments/grid.svg";
import imgGroup from "../../assets/appointments/arrow-group.svg";
import imgHeartPulse from "../../assets/appointments/heart.svg";
import imgHistory from "../../assets/appointments/history.svg";
import imgIconEllipsis from "../../assets/appointments/book/icon-ellipsis.svg";
import imgIconFolder from "../../assets/appointments/book/icon-folder.svg";
import imgIconPdf from "../../assets/appointments/book/icon-pdf.svg";
import imgImage from "../../assets/appointments/avatar.png";
import imgLine340 from "../../assets/appointments/line340.svg";
import imgLine355 from "../../assets/appointments/line355.svg";
import imgLine439 from "../../assets/appointments/line439.svg";
import imgLine453 from "../../assets/appointments/line453.svg";
import imgLine472 from "../../assets/appointments/line472.svg";
import imgLine477 from "../../assets/appointments/line477.svg";
import imgLogo21 from "../../assets/appointments/logo.png";
import imgPerson from "../../assets/appointments/person.svg";
import imgRectangle1 from "../../assets/appointments/sidebar-bg.png";
import imgSearch from "../../assets/appointments/search.svg";
import imgSettings from "../../assets/appointments/settings.svg";
import imgSize16ThemeRegular from "../../assets/appointments/book/delete-icon.svg";

function Button({ className }: { className?: string }) {
  return (
    <Link to="/appointments/confirm-booking" className={className || "content-stretch flex items-start relative"} data-node-id="1:2084" data-name="Button">
      <div className="bg-[#be880b] content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[6px] py-[8px] relative rounded-[8px] shrink-0 w-[271px]" data-node-id="1:2085" data-name="Button">
        <div className="[word-break:break-word] flex flex-col font-['Inter'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--color/grey/0,white)] tracking-[0.56px] whitespace-nowrap" data-node-id="I1:2085;208:17867">
          <p className="leading-none">Confirm</p>
        </div>
      </div>
    </Link>
  );
}

type DeleteProps = {
  className?: string;
  size?: "16";
  theme?: "Regular";
};

function Delete({ className, size: _size = "16", theme: _theme = "Regular" }: DeleteProps) {
  return (
    <div className={className || "relative size-[16px]"} data-node-id="1:2070">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSize16ThemeRegular} />
    </div>
  );
}

type Frame2085664956Props = {
  className?: string;
  property1?: "Variant5";
};

function Frame2085664956({ className, property1: _property1 = "Variant5" }: Frame2085664956Props) {
  return (
    <div className={className || "bg-white h-[969px] overflow-clip relative rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] w-[273px]"} data-node-id="1:1426">
      <div className="absolute contents left-0 top-0" data-node-id="1:1427">
        <div className="-translate-y-1/2 absolute h-[969px] left-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-1/2 w-[273px]" data-node-id="1:1428">
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]">
            <div className="absolute bg-white inset-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]" />
            <img alt="" className="absolute max-w-none object-cover opacity-68 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] size-full" src={imgRectangle1} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[257px] whitespace-nowrap" data-node-id="1:1429">
          Patients
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[321px] whitespace-nowrap" data-node-id="1:1430">
          Doctors
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[577px] whitespace-nowrap" data-node-id="1:1431">
          Sales
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[641px] whitespace-nowrap" data-node-id="1:1432">
          Activity Logs
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[448px] whitespace-nowrap" data-node-id="1:1433">
          Treatments
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[705px] whitespace-nowrap" data-node-id="1:1434">
          Billing
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[513px] whitespace-nowrap" data-node-id="1:1435">
          Medicines
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[769px] whitespace-nowrap" data-node-id="1:1436">
          Settings
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[81px] not-italic text-[#be880b] text-[12px] top-[120px] whitespace-nowrap" data-node-id="1:1437">
          A Journey of Healing
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-154.5px)]" data-node-id="1:1438" data-name="Doctor">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoctor} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-218.5px)]" data-node-id="1:1439" data-name="Person">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPerson} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+37.5px)]" data-node-id="1:1440" data-name="Briefcase Medical">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBriefcaseMedical} />
        </div>
        <div className="absolute bg-[#fffef7] h-[56px] left-[18px] rounded-bl-[10px] rounded-tl-[10px] top-[366px] w-[255px]" data-node-id="1:1441" />
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[74px] not-italic text-[#be880b] text-[16px] top-[385px] whitespace-nowrap" data-node-id="1:1442">
          Appointments
        </p>
        <div className="-translate-x-1/2 absolute border-[#be880b] border-[0.813px] border-solid left-[calc(50%-1px)] rounded-[57.846px] size-[47px] top-[40px]" data-node-id="1:1443" data-name="logo (2) 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[57.846px]">
            <img alt="" className="absolute left-[-73.08%] max-w-none size-[242.31%] top-[-26.92%]" src={imgLogo21} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[46px] not-italic text-[#422c23] text-[16px] top-[97px] whitespace-nowrap" data-node-id="1:1444">
          GANESHA AYURVEDAA
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[193px] whitespace-nowrap" data-node-id="1:1445">
          Dashboard
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+293.5px)]" data-node-id="1:1446" data-name="Settings">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSettings} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+165.5px)]" data-node-id="1:1447" data-name="History">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHistory} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+229.5px)]" data-node-id="1:1448" data-name="Document Bullet List">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDocumentBulletList} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+101.5px)]" data-node-id="1:1449" data-name="Data Histogram">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDataHistogram} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-26.5px)]" data-node-id="1:1450" data-name="Heart Pulse">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeartPulse} />
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-282.5px)]" data-node-id="1:1451" data-name="Grid">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGrid} />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-90.5px)]" data-node-id="1:1452" data-name="Calendar Person">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendarPerson} />
      </div>
    </div>
  );
}

function BookAppointmentStep3PageInner() {
  return (
    <div className="bg-[#fffef7] relative size-full" data-node-id="1:8026" data-name="Create new Patient ( Personal Information)">
      <div className="absolute left-[1384px] size-[32px] top-[86px]" data-node-id="1:8027">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </div>
      <div className="absolute left-[1136px] size-[32px] top-[86px]" data-node-id="1:8028">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1368px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:8029">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1184px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:8030">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+624px)] size-[16px] top-[calc(50%-1070.5px)]" data-node-id="1:8031" data-name="Chevron">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron} />
      </div>
      <div className="absolute bg-[#eee4cc] h-[38px] left-[321px] overflow-clip rounded-[10px] top-[24px] w-[1095px]" data-node-id="1:8032">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-27.5px)] top-[calc(50%+0.5px)]" data-node-id="1:8033">
          <p className="[word-break:break-word] absolute font-['Inter'] leading-[0] left-[calc(50%-300.5px)] not-italic text-[#422c23] text-[14px] top-[calc(50%-8px)] whitespace-pre" data-node-id="1:8034">
            <span className="font-['Inter'] font-medium leading-[normal]">{`Get Up to 50% Off on Ayurvedic Medicines & Wellness Products          `}</span>
            <span className="font-['Inter'] font-semibold leading-[normal] text-[#be880b]">{`  `}</span>
            <Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>
          </p>
        </div>
        <div className="-translate-y-1/2 absolute left-[1063px] size-[20px] top-1/2" data-node-id="1:8035" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
        <div className="absolute inset-[36.84%_35.61%_32.17%_61.72%]" data-node-id="1:8037" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
      </div>
      <div className="absolute left-[1200px] size-[32px] top-[86px]" data-node-id="1:8039" data-name="Image">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="32" src={imgImage} width="32" />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#422c23] text-[13px] top-[86px] whitespace-nowrap" data-node-id="1:8040">
        Rahul Sharma
      </p>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#737373] text-[11px] top-[107px] whitespace-nowrap" data-node-id="1:8041">
        Super Admin
      </p>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+680px)] size-[20px] top-[calc(50%-1070.5px)]" data-node-id="1:8042" data-name="Arrow Exit">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowExit} />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+432px)] size-[20px] top-[calc(50%-1070.5px)]" data-node-id="1:8043" data-name="Alert">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlert} />
      </div>
      <div className="absolute content-stretch flex items-center left-[321px] top-[93px]" data-node-id="1:8044" data-name="Breadcrumb Group">
        <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-node-id="1:8045" data-name="item 1">
          <div className="content-stretch flex items-center px-px relative shrink-0" data-node-id="I1:8045;70:24394" data-name="Link">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:8045;70:24394;0:7611">
              Breadcrumb 1
            </p>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[939px] top-[86px]" data-node-id="1:8046">
        <div className="absolute inset-[3.67%_22.22%_94.97%_65.21%]" data-node-id="1:8047" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[24px] left-[977px] not-italic text-[14px] text-white top-[90px] whitespace-nowrap" data-node-id="1:8048">
          Book Appointment
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-[calc(50%+243px)] top-[calc(50%-1069.5px)] w-[16px]" data-node-id="1:8049" data-name="Add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAdd} />
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[696px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[1095px]" data-node-id="1:8050">
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[785px] whitespace-nowrap" data-node-id="1:8051">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[860px] whitespace-nowrap" data-node-id="1:8052">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[785px] whitespace-nowrap" data-node-id="1:8053">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[860px] whitespace-nowrap" data-node-id="1:8054">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[785px] whitespace-nowrap" data-node-id="1:8055">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[860px] whitespace-nowrap" data-node-id="1:8056">
          Consultation
        </p>
        <div className="absolute h-0 left-[17px] top-[756px] w-[1062px]" data-node-id="1:8057">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine355} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[831px] w-[1062px]" data-node-id="1:8058">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine355} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[906px] w-[1062px]" data-node-id="1:8059">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine355} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[785px] whitespace-nowrap" data-node-id="1:8060">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[860px] whitespace-nowrap" data-node-id="1:8061">
          Completed
        </p>
        <div className="absolute inset-[3.45%_85.02%_91.38%_1.46%]" data-node-id="1:8062" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds1} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[24px] left-[32px] not-italic text-[#422c23] text-[14px] top-[30px] whitespace-nowrap" data-node-id="1:8063">
          All Appointments
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[191px] not-italic text-[#422c23] text-[14px] top-[30px] whitespace-nowrap" data-node-id="1:8064">
          All Follow Ups
        </p>
        <div className="absolute inset-[12.07%_46.76%_82.76%_36.99%]" data-node-id="1:8065" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[417px] not-italic text-[#67554d] text-[12px] top-[90px] whitespace-nowrap" data-node-id="1:8066">
          Patient ID
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+15.5px)] size-[16px] top-[calc(50%-246px)]" data-node-id="1:8067" data-name="Search">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
        </div>
        <div className="absolute inset-[12.07%_31.05%_82.76%_54.34%]" data-node-id="1:8068" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds3} />
        </div>
        <div className="absolute inset-[12.07%_14.98%_82.76%_70.41%]" data-node-id="1:8069" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds3} />
        </div>
        <div className="absolute inset-[12.07%_1.37%_82.76%_86.48%]" data-node-id="1:8070" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds4} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[607px] not-italic text-[#422c23] text-[12px] top-[90px] whitespace-nowrap" data-node-id="1:8071">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[783px] not-italic text-[#422c23] text-[12px] top-[90px] whitespace-nowrap" data-node-id="1:8072">
          Visit type
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+187.5px)] size-[16px] top-[calc(50%-246px)]" data-node-id="1:8073" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+349.5px)] size-[16px] top-[calc(50%-245px)]" data-node-id="1:8074" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+419.5px)] size-[16px] top-[calc(50%-246px)]" data-node-id="1:8075" data-name="Calendar">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendar} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[991px] not-italic text-[#67554d] text-[12px] top-[90px] whitespace-nowrap" data-node-id="1:8076">
          Date Created
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[292px] whitespace-nowrap" data-node-id="1:8077">
          #PT458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[357px] whitespace-nowrap" data-node-id="1:8078">
          #PT458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[422px] whitespace-nowrap" data-node-id="1:8079">
          #PT458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[487px] whitespace-nowrap" data-node-id="1:8080">
          #PT458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[552px] whitespace-nowrap" data-node-id="1:8081">
          #PT458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8082">
          #PT458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[594px] not-italic text-[#422c23] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8083">
          15 Oct 2026, 01:05 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[594px] not-italic text-[#422c23] text-[14px] top-[292px] whitespace-nowrap" data-node-id="1:8084">
          15 Oct 2026, 01:05 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[594px] not-italic text-[#422c23] text-[14px] top-[357px] whitespace-nowrap" data-node-id="1:8085">
          15 Oct 2026, 01:05 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[594px] not-italic text-[#422c23] text-[14px] top-[422px] whitespace-nowrap" data-node-id="1:8086">
          15 Oct 2026, 01:05 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[594px] not-italic text-[#422c23] text-[14px] top-[487px] whitespace-nowrap" data-node-id="1:8087">
          15 Oct 2026, 01:05 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[594px] not-italic text-[#422c23] text-[14px] top-[552px] whitespace-nowrap" data-node-id="1:8088">
          15 Oct 2026, 01:05 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[155px] not-italic text-[#422c23] text-[14px] top-[292px] whitespace-nowrap" data-node-id="1:8089">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[155px] not-italic text-[#422c23] text-[14px] top-[357px] whitespace-nowrap" data-node-id="1:8090">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[155px] not-italic text-[#422c23] text-[14px] top-[422px] whitespace-nowrap" data-node-id="1:8091">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[155px] not-italic text-[#422c23] text-[14px] top-[487px] whitespace-nowrap" data-node-id="1:8092">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[155px] not-italic text-[#422c23] text-[14px] top-[552px] whitespace-nowrap" data-node-id="1:8093">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[155px] not-italic text-[#422c23] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8094">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[155px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8095">
          Patient
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[16px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8096">
          UHID No.
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[306px] not-italic text-[#422c23] text-[14px] top-[292px] whitespace-nowrap" data-node-id="1:8097">{`Dr. Sheekha `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[306px] not-italic text-[#422c23] text-[14px] top-[357px] whitespace-nowrap" data-node-id="1:8098">{`Dr. Sheekha `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[306px] not-italic text-[#422c23] text-[14px] top-[422px] whitespace-nowrap" data-node-id="1:8099">{`Dr. Sheekha `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[306px] not-italic text-[#422c23] text-[14px] top-[487px] whitespace-nowrap" data-node-id="1:8100">{`Dr. Sheekha `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[306px] not-italic text-[#422c23] text-[14px] top-[552px] whitespace-nowrap" data-node-id="1:8101">{`Dr. Sheekha `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[306px] not-italic text-[#422c23] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8102">{`Dr. Sheekha `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[306px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8103">
          Doctor
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8104">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[292px] whitespace-nowrap" data-node-id="1:8105">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[357px] whitespace-nowrap" data-node-id="1:8106">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[422px] whitespace-nowrap" data-node-id="1:8107">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[487px] whitespace-nowrap" data-node-id="1:8108">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[552px] whitespace-nowrap" data-node-id="1:8109">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[447px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8110">
          Visit Type
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[807px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8111">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[964px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8112">
          Action
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[594px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[168px] whitespace-nowrap" data-node-id="1:8113">
          Appointment Date
        </p>
        <div className="absolute h-0 left-[17px] top-[268px] w-[1055px]" data-node-id="1:8114">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[333px] w-[1055px]" data-node-id="1:8115">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine439} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[398px] w-[1055px]" data-node-id="1:8116">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine439} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[463px] w-[1055px]" data-node-id="1:8117">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine439} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[528px] w-[1055px]" data-node-id="1:8118">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine439} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[593px] w-[1055px]" data-node-id="1:8119">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine439} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[144px] w-[1055px]" data-node-id="1:8120">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine472} />
          </div>
        </div>
        <div className="absolute bg-[#fae3e2] border-[#dc2626] border-[0.23px] border-solid h-[27px] left-[964px] rounded-[16px] top-[217px] w-[88px]" data-node-id="1:8121" />
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[984px] not-italic text-[#dc2626] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8122">
          Cancel
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[807px] not-italic text-[#eab308] text-[14px] top-[222px] whitespace-nowrap" data-node-id="1:8123">
          Scheduled
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[807px] not-italic text-[#2e7d32] text-[14px] top-[292px] whitespace-nowrap" data-node-id="1:8124">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[807px] not-italic text-[#2e7d32] text-[14px] top-[357px] whitespace-nowrap" data-node-id="1:8125">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[807px] not-italic text-[#2e7d32] text-[14px] top-[422px] whitespace-nowrap" data-node-id="1:8126">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[807px] not-italic text-[#2e7d32] text-[14px] top-[487px] whitespace-nowrap" data-node-id="1:8127">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[807px] not-italic text-[#2e7d32] text-[14px] top-[552px] whitespace-nowrap" data-node-id="1:8128">
          Completed
        </p>
        <div className="absolute contents left-[991px] top-[24px]" data-node-id="1:8129">
          <div className="absolute bg-white h-[36px] left-[991px] rounded-[8px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.15)] top-[24px] w-[80px]" data-node-id="1:8130" />
          <div className="absolute bg-[#be880b] h-[36px] left-[991px] rounded-[8px] top-[24px] w-[40px]" data-node-id="1:8131" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+463.5px)] size-[20px] top-[calc(50%-306px)]" data-node-id="1:8132" data-name="Apps List">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAppsList} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+503.5px)] size-[20px] top-[calc(50%-306px)]" data-node-id="1:8133" data-name="Calendar">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendar1} />
          </div>
        </div>
      </div>
      <Frame2085664956 className="absolute bg-white h-[969px] left-[24px] overflow-clip rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-[24px] w-[273px]" />
      <Link to="/appointments/create-patient/step-2" className="absolute bg-[rgba(49,49,49,0.45)] block cursor-pointer h-[2463px] left-0 top-px w-[1440px]" data-node-id="1:8135" aria-label="Close" />
      <div className="absolute bg-white h-[2037px] left-[172px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[146px] w-[1095px]" data-node-id="1:8136">
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[1.5] left-[16px] not-italic text-[13px] text-[#737373] top-[52px] whitespace-nowrap" data-node-id="1:8137">{`Please fill out the patient registration details `}</p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[16px] top-[24px] whitespace-nowrap" data-node-id="1:8138">
          Create New Patient
        </p>
        <Link to="/appointments/create-patient" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[57px] not-italic text-[#be880b] text-[14px] top-[100px] whitespace-nowrap" data-node-id="1:8139">
          <p className="leading-[1.5]">Personal Information</p>
        </Link>
        <Link to="/appointments/create-patient" className="absolute bg-[#be880b] block border-2 border-[#be880b] border-solid cursor-pointer left-[16px] overflow-clip rounded-[50px] size-[30px] top-[96px]" data-node-id="1:8140">
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[1.5] left-[9px] not-italic text-[14px] text-left text-white top-[2px] whitespace-nowrap" data-node-id="1:8141">
            1
          </p>
        </Link>
        <Link to="/appointments/create-patient/step-2" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[312px] not-italic text-[#be880b] text-[14px] top-[100px] whitespace-nowrap" data-node-id="1:8142">
          <p className="leading-[1.5]">Therapy Details</p>
        </Link>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[1.5] left-[532px] not-italic text-[#be880b] text-[14px] top-[100px] whitespace-nowrap" data-node-id="1:8143">
          Medical Assessment
        </p>
        <Link to="/appointments/create-patient/step-2" className="absolute bg-[#be880b] block cursor-pointer left-[270px] overflow-clip rounded-[50px] size-[30px] top-[96px]" data-node-id="1:8144">
          <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[1.5] left-[11px] not-italic text-[14px] text-left text-white top-[4px] whitespace-nowrap" data-node-id="1:8145">
            2
          </p>
        </Link>
        <div className="absolute bg-[#be880b] left-[490px] overflow-clip rounded-[50px] size-[30px] top-[96px]" data-node-id="1:8146">
          <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[1.5] left-[11px] not-italic text-[14px] text-white top-[4px] whitespace-nowrap" data-node-id="1:8147">
            3
          </p>
        </div>
        <div className="absolute h-0 left-[214px] top-[110px] w-[40px]" data-node-id="1:8148">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine453} />
          </div>
        </div>
        <div className="absolute h-0 left-[434px] top-[110px] w-[40px]" data-node-id="1:8149">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine453} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[1322px] w-[1063px]" data-node-id="1:8150">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8151">
            Treatment Plan
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8152" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[16px] top-[1366px] w-[524px]" data-node-id="1:8154">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:8155">
            <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8156">
              <p className="leading-[normal]">{`Investigation & Plant Suggested`}</p>
            </div>
            <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8157">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8158">{`Investigation & Plant Suggested`}</p>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[556px] top-[1366px] w-[524px]" data-node-id="1:8159">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8160">
            <p className="leading-[normal]">Plan Taken</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8161">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8162">
              Plan Taken
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[396px] w-[1063px]" data-node-id="1:8163">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8164">
            Physical Examination
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8165" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[1175px] w-[1063px]" data-node-id="1:8167">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8168">
            Systemic Examination
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8169" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[1466px] w-[1063px]" data-node-id="1:8171">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8172">
            Upload Reports
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8173" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[704px] w-[1063px]" data-node-id="1:8175">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8176">
            Medical History
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8177" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[158px] w-[1063px]" data-node-id="1:8179">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8180">
            Ayurvedic Assessment
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8181" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[1031px] w-[1063px]" data-node-id="1:8183">
          <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[#422c23] text-[16px] whitespace-nowrap" data-node-id="1:8184">
            Lifestyle Information
          </p>
          <div className="relative shrink-0 size-[24px]" data-node-id="1:8185" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[444px] w-[200px]" data-node-id="1:8187">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8188">
            <p className="leading-[normal]">Weight</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8189">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8190">
              Weight
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[1223px] w-[200px]" data-node-id="1:8191">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8192">
            <p className="leading-[normal]">Cardiovascular</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8193">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8194">
              Cardiovascular
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[524px] w-[200px]" data-node-id="1:8195">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8196">
            <p className="leading-[normal]">Temperature</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8197">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8198">
              Temperature
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[604px] w-[200px]" data-node-id="1:8199">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8200">
            <p className="leading-[normal]">Oedema</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8201">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8202">
              Oedema
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[232px] top-[444px] w-[200px]" data-node-id="1:8203">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8204">
            <p className="leading-[normal]">Height</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8205">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8206">
              Height
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[232px] top-[1223px] w-[200px]" data-node-id="1:8207">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8208">
            <p className="leading-[normal]">Respiratory</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8209">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8210">
              Respiratory
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[448px] top-[444px] w-[200px]" data-node-id="1:8211">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8212">
            <p className="leading-[normal]">IBW</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8213">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8214">
              IBW
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[448px] top-[1222px] w-[200px]" data-node-id="1:8215">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8216">
            <p className="leading-[normal]">Nervous</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8217">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8218">
              Nervous
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[665px] top-[444px] w-[200px]" data-node-id="1:8219">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8220">
            <p className="leading-[normal]">Pulse</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8221">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8222">
              Pulse
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[664px] top-[1223px] w-[200px]" data-node-id="1:8223">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8224">
            <p className="leading-[normal]">{`Abdomen & GI`}</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8225">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8226">{`Abdomen & GI`}</p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[232px] top-[524px] w-[200px]" data-node-id="1:8227">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8228">
            <p className="leading-[normal]">Pallor</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8229">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8230">
              Pallor
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[232px] top-[604px] w-[200px]" data-node-id="1:8231">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8232">
            <p>
              <span className="leading-[normal]">S</span>
              <span className="leading-[normal] lowercase">ENSORIUM</span>
            </p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8233">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[0] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8234">
              <span className="leading-[normal]">S</span>
              <span className="leading-[normal] lowercase">ENSORIUM</span>
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[448px] top-[524px] w-[200px]" data-node-id="1:8235">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8236">
            <p className="leading-[normal]">Icterus</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8237">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8238">
              Icterus
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[448px] top-[604px] w-[200px]" data-node-id="1:8239">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8240">
            <p>
              <span className="leading-[normal]">A</span>
              <span className="leading-[normal] lowercase">{`CIDITY `}</span>
              <span className="leading-[normal]">/ G</span>
              <span className="leading-[normal] lowercase">AS</span>
            </p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8241">
            <p className="[word-break:break-word] font-['Inter'] font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-[#737373] whitespace-nowrap" data-node-id="1:8242">
              <span className="leading-[normal]">A</span>
              <span className="leading-[normal] lowercase">{`CIDITY `}</span>
              <span className="leading-[normal]">/ G</span>
              <span className="leading-[normal] lowercase">AS</span>
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[665px] top-[524px] w-[200px]" data-node-id="1:8243">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8244">
            <p className="leading-[normal]">Cyanosis</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8245">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8246">
              Cyanosis
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[665px] top-[604px] w-[200px]" data-node-id="1:8247">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8248">
            <p className="leading-[normal]">Motion</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8249">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8250">
              Motion
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[881px] top-[444px] w-[198px]" data-node-id="1:8251">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8252">
            <p className="leading-[normal]">BP</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8253">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8254">
              BP
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[880px] top-[1223px] w-[199px]" data-node-id="1:8255">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8256">
            <p className="leading-[normal]">Locomotor</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8257">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8258">
              Locomotor
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[881px] top-[524px] w-[198px]" data-node-id="1:8259">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8260">
            <p>
              <span className="leading-[normal]">L</span>
              <span className="leading-[normal] lowercase">YMPH</span>
              <span className="leading-[normal]">{` N`}</span>
              <span className="leading-[normal] lowercase">ODES</span>
            </p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8261">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[0] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8262">
              <span className="leading-[normal]">L</span>
              <span className="leading-[normal] lowercase">YMPH</span>
              <span className="leading-[normal]">{` N`}</span>
              <span className="leading-[normal] lowercase">ODES</span>
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[881px] top-[604px] w-[198px]" data-node-id="1:8263">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:8264">
            <p>
              <span className="leading-[normal]">M</span>
              <span className="leading-[normal] lowercase">ICTURITION</span>
            </p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8265">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[0] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8266">
              <span className="leading-[normal]">M</span>
              <span className="leading-[normal] lowercase">ICTURITION</span>
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[16px] top-[752px] w-[524px]" data-node-id="1:8267">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:8268">
            <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8269">
              <p className="leading-[normal]">Past Medical Conditions</p>
            </div>
            <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8270">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8271">
                Past Medical Conditions
              </p>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[556px] top-[752px] w-[523px]" data-node-id="1:8272">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8273">
            <p className="leading-[normal]">Past Surgeries</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8274">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8275">
              Past Surgeries
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:8276" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[206px] w-[524px]" data-node-id="1:8278">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8279">
            <p className="leading-[normal]">Dosha Type</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8280">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[0] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8281">
              <span className="leading-[normal]">Dosha</span>
              <span className="leading-[normal]">{` Type`}</span>
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:8282" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[832px] w-[524px]" data-node-id="1:8284">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8285">
            <p className="leading-[normal]">Current Medications</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8286">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8287">
              Current Medications
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:8288" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[556px] top-[832px] w-[523px]" data-node-id="1:8290">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8291">
            <p className="leading-[normal]">Allergies</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8292">
            <div className="bg-white border border-[#e2e2e2] border-solid content-stretch flex gap-[7.071px] items-center justify-center py-[2.829px] relative rounded-[16.264px] shrink-0 w-[99px]" data-node-id="1:8293">
              <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[12.729px] text-black whitespace-nowrap" data-node-id="1:8294">
                Allergy 1
              </p>
              <div className="relative shrink-0 size-[12.729px]" data-node-id="1:8295" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
            </div>
            <div className="bg-white border border-[#e2e2e2] border-solid content-stretch flex gap-[7.071px] items-center justify-center py-[2.829px] relative rounded-[16.264px] shrink-0 w-[99px]" data-node-id="1:8297">
              <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[12.729px] text-black whitespace-nowrap" data-node-id="1:8298">
                Allergy 2
              </p>
              <div className="relative shrink-0 size-[12.729px]" data-node-id="1:8299" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
            </div>
            <div className="absolute left-[495px] size-[20px] top-[7px]" data-node-id="1:8301" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[556px] top-[206px] w-[523px]" data-node-id="1:8303">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8304">
            <p className="leading-[normal]">Body Constitution</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8305">
            <div className="bg-white border border-[#e2e2e2] border-solid content-stretch flex gap-[7.071px] items-center justify-center py-[2.829px] relative rounded-[16.264px] shrink-0 w-[99px]" data-node-id="1:8306">
              <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[12.729px] text-black whitespace-nowrap" data-node-id="1:8307">
                Lean
              </p>
              <div className="relative shrink-0 size-[12.729px]" data-node-id="1:8308" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
            </div>
            <div className="bg-white border border-[#e2e2e2] border-solid content-stretch flex gap-[7.071px] items-center justify-center py-[2.829px] relative rounded-[16.264px] shrink-0 w-[99px]" data-node-id="1:8310">
              <p className="[word-break:break-word] font-['Inter'] font-medium leading-[1.5] not-italic relative shrink-0 text-[12.729px] text-black whitespace-nowrap" data-node-id="1:8311">
                Dry Skin
              </p>
              <div className="relative shrink-0 size-[12.729px]" data-node-id="1:8312" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
            </div>
            <div className="absolute left-[495px] size-[20px] top-[7px]" data-node-id="1:8314" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[16px] top-[912px] w-[1063px]" data-node-id="1:8316">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:8317">
            <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:8318">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:8319">
                <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8320">
                  <p className="leading-[normal]">Family History</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[55px] items-start px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8321">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8322">
                    Family History
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[16px] top-[285px] w-[1063px]" data-node-id="1:8323">
          <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:8324">
            <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="1:8325">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:8326">
                <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8327">
                  <p className="leading-[normal]">Current Imbalances</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[55px] items-start px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8328">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8329">
                    Current Imbalances
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start left-[16px] top-[1075px] w-[252px]" data-node-id="1:8330">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start justify-center min-w-px relative" data-node-id="1:8331">
            <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8332">
              <p className="leading-[normal]">Diet Type</p>
            </div>
            <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8333">
              <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8334">
                Diet Type
              </p>
              <div className="relative shrink-0 size-[20px]" data-node-id="1:8335" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[286px] top-[1075px] w-[251px]" data-node-id="1:8337">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8338">
            <p className="leading-[normal]">Sleep Pattern</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8339">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8340">
              Sleep Pattern
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[555px] top-[1075px] w-[252px]" data-node-id="1:8341">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8342">
            <p className="leading-[normal]">Exercise Habits</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8343">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8344">
              Exercise Habits
            </p>
            <div className="relative shrink-0 size-[20px]" data-node-id="1:8345" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[825px] top-[1075px] w-[254px]" data-node-id="1:8347">
          <div className="[word-break:break-word] flex flex-col font-['Inter'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:8348">
            <p className="leading-[normal]">Addiction</p>
          </div>
          <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:8349">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Inter'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:8350">
              Addiction
            </p>
          </div>
        </div>
        <div className="absolute content-stretch flex items-start justify-center left-[16px] top-[1510px] w-[1063px]" data-node-id="1:8351">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-center min-w-px relative" data-node-id="1:8352">
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-node-id="1:8353">
              <div className="bg-gradient-to-r flex-[1_0_0] from-[rgba(205,213,223,0)] h-[0.6px] min-w-px relative to-[#cdd5df]" data-node-id="1:8354" />
              <div className="[word-break:break-word] flex flex-col font-['Inter'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#be880b] text-[length:var(--typography\/font-size\/12,12px)] text-center uppercase whitespace-nowrap" data-node-id="1:8355">
                <p className="leading-[16px]">Past Medical Reports | PRESCRIPTIONS | LAB REPORTS</p>
              </div>
              <div className="bg-gradient-to-r flex-[1_0_0] from-[#cdd5df] h-[0.6px] min-w-px relative to-[rgba(205,213,223,0)]" data-node-id="1:8356" />
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="1:8357">
              <div className="bg-[#faf7ee] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px overflow-clip relative" data-node-id="1:8358" data-name="File Uploader">
                <div className="bg-white border-[#ede2ca] border-[0.6px] border-dashed content-stretch flex flex-col gap-[8px] items-center justify-center px-[16px] py-[20px] relative rounded-[10px] shrink-0 w-full" data-node-id="1:8365">
                  <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0 w-full" data-node-id="1:8366">
                    <div className="bg-[#be880b] content-stretch flex items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[48px]" data-node-id="1:8367">
                      <div className="relative shrink-0 size-[28px]" data-node-id="1:8368" data-name="Frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[5px] items-center justify-center leading-[0] not-italic relative shrink-0 text-center w-full" data-node-id="1:8371">
                      <div className="flex flex-col font-['Inter'] font-medium justify-center relative shrink-0 text-[#422c23] text-[length:var(--typography\/font-size\/14,14px)] w-full" data-node-id="1:8372">
                        <p className="leading-[18px]">Tap to upload photo</p>
                      </div>
                      <p className="font-['Inter'] font-normal relative shrink-0 text-[0px] text-[color:var(--text-\+-icon\/quaternary\(500\),#697586)] w-full" data-node-id="1:8373">
                        <span className="leading-[16px] text-[12px]">{`Only Supported: `}</span>
                        <span className="font-['Inter'] font-medium leading-[16px] text-[#697586] text-[12px]">.jpg</span>
                        <span className="leading-[16px] text-[12px]">{`, `}</span>
                        <span className="font-['Inter'] font-medium leading-[16px] text-[#697586] text-[12px]">.jpeg</span>
                        <span className="leading-[16px] text-[12px]">{`, `}</span>
                        <span className="font-['Inter'] font-medium leading-[16px] text-[#697586] text-[12px]">.png</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-[16px] pb-[16px] top-[1699px] w-[1063px]" data-node-id="1:8390">
          <div className="bg-[#ebeff2] h-px relative shrink-0 w-full" data-node-id="1:8391" />
          <div className="content-stretch flex flex-col gap-[12px] items-center px-[16px] relative shrink-0 w-full" data-node-id="1:8392" data-name="Uploads">
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="1:8393" data-name="Upload Item">
              <div className="content-stretch flex gap-[14px] items-center pr-[24px] relative shrink-0 w-full" data-node-id="I1:8393;62:103" data-name="Wrap">
                <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-node-id="I1:8393;62:104" data-name="Details">
                  <div className="relative shrink-0 size-[16px]" data-node-id="I1:8393;62:470" data-name="Icon / PDF">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconFolder} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px not-italic relative text-[#422c23]" data-node-id="I1:8393;62:111" data-name="Text">
                    <p className="font-['Inter'] font-medium leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="I1:8393;62:112">
                      Stock Photos
                    </p>
                    <p className="font-['Inter'] font-normal leading-[14px] relative shrink-0 text-[12px] w-full" data-node-id="I1:8393;62:113">
                      3m ago
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="I1:8393;62:1020" data-name="Tags">
                  <div className="border border-[#cdd3d8] border-solid content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[2px] shrink-0" data-node-id="I1:8393;62:114" data-name="Tag">
                    <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[12px] not-italic relative shrink-0 text-[#422c23] text-[11px] text-center whitespace-nowrap" data-node-id="I1:8393;62:114;62:57">
                      2.20GB
                    </p>
                  </div>
                </div>
                <div className="h-[13px] relative shrink-0 w-[3px]" data-node-id="I1:8393;62:115" data-name="Icon / Ellipsis">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconEllipsis} />
                </div>
              </div>
              <div className="bg-[#ebeff2] h-px relative shrink-0 w-full" data-node-id="I1:8393;62:116" data-name="li" />
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start pr-[24px] relative shrink-0 w-full" data-node-id="1:8394" data-name="Upload Item">
              <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-node-id="I1:8394;62:103" data-name="Wrap">
                <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-node-id="I1:8394;62:104" data-name="Details">
                  <div className="relative shrink-0 size-[16px]" data-node-id="I1:8394;62:470" data-name="Icon / PDF">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconPdf} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px not-italic relative text-[#422c23]" data-node-id="I1:8394;62:111" data-name="Text">
                    <p className="font-['Inter'] font-medium leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="I1:8394;62:112">
                      user-journey-01.pdf
                    </p>
                    <p className="font-['Inter'] font-normal leading-[14px] relative shrink-0 text-[12px] w-full" data-node-id="I1:8394;62:113">
                      2m ago
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="I1:8394;62:1020" data-name="Tags">
                  <div className="border border-[#cdd3d8] border-solid content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[2px] shrink-0" data-node-id="I1:8394;62:114" data-name="Tag">
                    <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[12px] not-italic relative shrink-0 text-[#422c23] text-[11px] text-center whitespace-nowrap" data-node-id="I1:8394;62:114;62:57">
                      604KB
                    </p>
                  </div>
                </div>
                <div className="h-[13px] relative shrink-0 w-[3px]" data-node-id="I1:8394;62:115" data-name="Icon / Ellipsis">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconEllipsis} />
                </div>
              </div>
              <div className="bg-[#ebeff2] h-px relative shrink-0 w-full" data-node-id="I1:8394;62:116" data-name="li" />
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start pr-[24px] relative shrink-0 w-full" data-node-id="1:8395" data-name="Upload Item">
              <div className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full" data-node-id="I1:8395;62:103" data-name="Wrap">
                <div className="content-stretch flex flex-[1_0_0] gap-[16px] items-start min-w-px relative" data-node-id="I1:8395;62:104" data-name="Details">
                  <div className="relative shrink-0 size-[16px]" data-node-id="I1:8395;62:470" data-name="Icon / PDF">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconFolder} />
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px not-italic relative text-[#422c23]" data-node-id="I1:8395;62:111" data-name="Text">
                    <p className="font-['Inter'] font-medium leading-[16px] relative shrink-0 text-[14px] w-full" data-node-id="I1:8395;62:112">
                      Optimised Photos
                    </p>
                    <p className="font-['Inter'] font-normal leading-[14px] relative shrink-0 text-[12px] w-full" data-node-id="I1:8395;62:113">
                      3 days ago
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="I1:8395;62:1020" data-name="Tags">
                  <div className="border border-[#cdd3d8] border-solid content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[2px] shrink-0" data-node-id="I1:8395;62:114" data-name="Tag">
                    <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[12px] not-italic relative shrink-0 text-[#422c23] text-[11px] text-center whitespace-nowrap" data-node-id="I1:8395;62:114;62:57">
                      1.46MB
                    </p>
                  </div>
                </div>
                <div className="h-[13px] relative shrink-0 w-[3px]" data-node-id="I1:8395;62:115" data-name="Icon / Ellipsis">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIconEllipsis} />
                </div>
              </div>
              <div className="bg-[#ebeff2] h-px relative shrink-0 w-full" data-node-id="I1:8395;62:116" data-name="li" />
            </div>
          </div>
        </div>
        <Delete className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%+522.5px)] top-[calc(50%+714.5px)] w-[18px]" />
        <Delete className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%+522.5px)] top-[calc(50%+777.5px)] w-[18px]" />
        <Delete className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%+522.5px)] top-[calc(50%+840.5px)] w-[18px]" />
        <Button className="absolute content-stretch cursor-pointer flex items-start left-[808px] top-[1949px]" />
      </div>
    </div>
  );
}

export default function BookAppointmentStep3Page() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[2345px] w-[1440px] shrink-0 overflow-visible">
        <BookAppointmentStep3PageInner />
      </div>
    </div>
  );
}
