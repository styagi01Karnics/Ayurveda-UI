import { Link } from "react-router-dom";
import imgAdd from "../../assets/appointments/add.svg";
import imgAlert from "../../assets/appointments/alert.svg";
import imgArrowExit from "../../assets/appointments/arrow-exit.svg";
import imgBounds from "../../assets/appointments/search-bg.svg";
import imgBounds1 from "../../assets/appointments/filter-bg.svg";
import imgBounds2 from "../../assets/appointments/book-btn-bg.svg";
import imgBriefcaseMedical from "../../assets/appointments/briefcase.svg";
import imgCalendarPerson from "../../assets/appointments/calendar-person.svg";
import imgChevron from "../../assets/appointments/chevron.svg";
import imgChevron1 from "../../assets/appointments/chevron1.svg";
import imgChevron2 from "../../assets/appointments/chevron1.svg";
import imgDataHistogram from "../../assets/appointments/histogram.svg";
import imgDoctor from "../../assets/appointments/doctor.svg";
import imgDocumentBulletList from "../../assets/appointments/document.svg";
import imgEllipse3704 from "../../assets/appointments/ellipse.svg";
import imgEllipse3705 from "../../assets/appointments/ellipse2.svg";
import imgFrame from "../../assets/appointments/close.svg";
import imgGrid from "../../assets/appointments/grid.svg";
import imgGroup from "../../assets/appointments/arrow-group.svg";
import imgHeartPulse from "../../assets/appointments/heart.svg";
import imgHistory from "../../assets/appointments/history.svg";
import imgImage from "../../assets/appointments/avatar.png";
import imgLine340 from "../../assets/appointments/line340.svg";
import imgLine449 from "../../assets/doctors/line449.svg";
import imgLine450 from "../../assets/doctors/line450.svg";
import imgLine472 from "../../assets/appointments/line472.svg";
import imgLine477 from "../../assets/appointments/line477.svg";
import imgLogo21 from "../../assets/appointments/logo.png";
import imgPerson from "../../assets/appointments/person.svg";
import imgPersonAdd from "../../assets/appointments/person-add.svg";
import imgPersonAdd1 from "../../assets/appointments/person-add-filled.svg";
import imgRectangle1 from "../../assets/appointments/sidebar-bg.png";
import imgSearch from "../../assets/appointments/search.svg";
import imgSettings from "../../assets/appointments/settings.svg";


function SettingsPageInner() {
  return (
    <div className="bg-[#fffef7] relative size-full" data-node-id="1:9360" data-name="User management Settings">
      <a className="absolute block cursor-pointer left-[1384px] size-[32px] top-[86px]" data-node-id="1:9361">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </a>
      <div className="absolute left-[1136px] size-[32px] top-[86px]" data-node-id="1:9362">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3705} />
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1368px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:9363">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1184px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:9364">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <Link to="/dashboard/profile-dropdown" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+624px)] size-[16px] top-[calc(50%-410px)]" data-node-id="1:9365" data-name="Chevron">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron} />
      </Link>
      <div className="absolute bg-[#eee4cc] h-[38px] left-[321px] overflow-clip rounded-[10px] top-[24px] w-[1095px]" data-node-id="1:9366">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-27.5px)] top-[calc(50%+0.5px)]" data-node-id="1:9367">
          <p className="[word-break:break-word] absolute font-['Inter'] leading-[0] left-[calc(50%-300.5px)] not-italic text-[#422c23] text-[14px] top-[calc(50%-8px)] whitespace-pre" data-node-id="1:9368">
            <span className="font-['Inter'] font-medium leading-[normal]">{`Get Up to 50% Off on Ayurvedic Medicines & Wellness Products          `}</span>
            <span className="font-['Inter'] font-semibold leading-[normal] text-[#be880b]">{`  `}</span>
            <Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>
          </p>
        </div>
        <div className="-translate-y-1/2 absolute left-[1063px] size-[20px] top-1/2" data-node-id="1:9369" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
        <div className="absolute inset-[36.84%_35.61%_32.17%_61.72%]" data-node-id="1:9371" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
      </div>
      <div className="absolute left-[1200px] size-[32px] top-[86px]" data-node-id="1:9373" data-name="Image">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="32" src={imgImage} width="32" />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#422c23] text-[13px] top-[86px] whitespace-nowrap" data-node-id="1:9374">
        Rahul Sharma
      </p>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#737373] text-[11px] top-[107px] whitespace-nowrap" data-node-id="1:9375">
        Super Admin
      </p>
      <Link to="/dashboard/logout-popup" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+680px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:9376" data-name="Arrow Exit">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowExit} />
      </Link>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+432px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:9377" data-name="Alert">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlert} />
      </div>
      <div className="absolute content-stretch flex items-center left-[320px] top-[93px]" data-node-id="1:9378" data-name="Breadcrumb Group">
        <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-node-id="1:9379" data-name="item 1">
          <div className="content-stretch flex items-center px-px relative shrink-0" data-node-id="I1:9379;70:24394" data-name="Link">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:8419;70:24394;0:7611">Settings</p>
          </div>
        </div>
      </div>
      <div className="absolute bg-white h-[969px] left-[24px] overflow-clip rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-[24px] w-[273px]" data-node-id="1:9380">
        <div className="absolute contents left-0 top-0" data-node-id="I1:9380;509:16956">
          <div className="-translate-y-1/2 absolute h-[969px] left-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-1/2 w-[273px]" data-node-id="I1:9380;509:16957">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]">
              <div className="absolute bg-white inset-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]" />
              <img alt="" className="absolute max-w-none object-cover opacity-68 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] size-full" src={imgRectangle1} />
            </div>
          </div>
          <Link to="/patients" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[257px] whitespace-nowrap" data-node-id="I1:9380;509:16958">
            <p className="leading-[normal]">Patients</p>
          </Link>
          <Link to="/doctors" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[321px] whitespace-nowrap" data-node-id="I1:9380;509:16959">
            <p className="leading-[normal]">Doctors</p>
          </Link>
          <Link to="/sales" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[577px] whitespace-nowrap" data-node-id="I1:9380;509:16960">
            <p className="leading-[normal]">Sales</p>
          </Link>
          <Link to="/activity-log" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[641px] whitespace-nowrap" data-node-id="I1:9380;509:16961">
            <p className="leading-[normal]">Activity Logs</p>
          </Link>
          <Link to="/treatments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[448px] whitespace-nowrap" data-node-id="I1:9380;509:16962">
            <p className="leading-[normal]">Treatments</p>
          </Link>
          <Link to="/billing" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[705px] whitespace-nowrap" data-node-id="I1:9380;509:16963">
            <p className="leading-[normal]">Billing</p>
          </Link>
          <Link to="/medicines" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[513px] whitespace-nowrap" data-node-id="I1:9380;509:16964">
            <p className="leading-[normal]">Medicines</p>
          </Link>
          <div className="absolute bg-[#fffef7] h-[56px] left-[18px] rounded-bl-[10px] rounded-tl-[10px] top-[750px] w-[255px]" data-node-id="I1:9380;509:16965" />
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[74px] not-italic text-[#be880b] text-[16px] top-[769px] whitespace-nowrap" data-node-id="I1:9380;509:16966">
            Settings
          </p>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[81px] not-italic text-[#be880b] text-[12px] top-[120px] whitespace-nowrap" data-node-id="I1:9380;509:16967">
            A Journey of Healing
          </p>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-154.5px)]" data-node-id="I1:9380;509:16968" data-name="Doctor">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoctor} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-218.5px)]" data-node-id="I1:9380;509:16969" data-name="Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+37.5px)]" data-node-id="I1:9380;509:16970" data-name="Briefcase Medical">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBriefcaseMedical} />
          </div>
          <Link to="/appointments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[385px] whitespace-nowrap" data-node-id="I1:9380;509:16971">
            <p className="leading-[normal]">Appointments</p>
          </Link>
          <div className="-translate-x-1/2 absolute border-[#be880b] border-[0.813px] border-solid left-[calc(50%-1px)] rounded-[57.846px] size-[47px] top-[40px]" data-node-id="I1:9380;509:16972" data-name="logo (2) 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[57.846px]">
              <img alt="" className="absolute left-[-73.08%] max-w-none size-[242.31%] top-[-26.92%]" src={imgLogo21} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[46px] not-italic text-[#422c23] text-[16px] top-[97px] whitespace-nowrap" data-node-id="I1:9380;509:16973">
            GANESHA AYURVEDAA
          </p>
          <Link to="/dashboard" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[193px] whitespace-nowrap" data-node-id="I1:9380;509:16974">
            <p className="leading-[normal]">Dashboard</p>
          </Link>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-90.5px)]" data-node-id="I1:9380;509:16975" data-name="Calendar Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendarPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+165.5px)]" data-node-id="I1:9380;509:16976" data-name="History">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHistory} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+229.5px)]" data-node-id="I1:9380;509:16977" data-name="Document Bullet List">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDocumentBulletList} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+101.5px)]" data-node-id="I1:9380;509:16978" data-name="Data Histogram">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDataHistogram} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-26.5px)]" data-node-id="I1:9380;509:16979" data-name="Heart Pulse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeartPulse} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-282.5px)]" data-node-id="I1:9380;509:16980" data-name="Grid">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGrid} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+293.5px)]" data-node-id="I1:9380;509:16981" data-name="Settings">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSettings} />
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[851px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[1095px]" data-node-id="1:9381">
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[1.5] left-[16px] not-italic text-[#422c23] text-[14px] top-[24px] whitespace-nowrap" data-node-id="1:9382">
          Clinic Settings
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[1.5] left-[235px] not-italic text-[#be880b] text-[14px] top-[24px] whitespace-nowrap" data-node-id="1:9383">
          User Management
        </p>
        <Link to="/settings/roles" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[479px] not-italic text-[#422c23] text-[14px] top-[24px] whitespace-nowrap" data-node-id="1:9384">
          <p className="leading-[1.5]">Role Management</p>
        </Link>
        <Link to="/settings/preferences" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[720px] not-italic text-[#422c23] text-[14px] top-[24px] whitespace-nowrap" data-node-id="1:9385">
          <p className="leading-[1.5]">System Preference</p>
        </Link>
        <div className="absolute h-0 left-[16px] top-[63px] w-[1063px]" data-node-id="1:9386">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine449} />
          </div>
        </div>
        <div className="absolute h-0 left-[234px] top-[63px] w-[125px]" data-node-id="1:9387">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine450} />
          </div>
        </div>
        <div className="absolute bg-[#be880b] h-[28px] left-[721px] opacity-10 rounded-[16px] top-[226px] w-[111px]" data-node-id="1:9388" />
        <div className="absolute bg-[#fff4d9] border border-[#be880b] border-solid h-[28px] left-[903px] rounded-[16px] top-[226px] w-[131px]" data-node-id="1:9389" />
        <div className="absolute bg-[#fff4d9] border border-[#be880b] border-solid h-[28px] left-[903px] rounded-[16px] top-[314px] w-[131px]" data-node-id="1:9390" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+466.5px)] size-[16px] top-[calc(50%-184.5px)]" data-node-id="1:9391" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+466.5px)] size-[16px] top-[calc(50%-96.5px)]" data-node-id="1:9392" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[410px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[171px] w-[36px]" data-node-id="1:9393">
          Email
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[597px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[171px] w-[43px]" data-node-id="1:9394">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[721px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[171px] w-[95px]" data-node-id="1:9395">
          Assigned Role
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[902px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[171px] w-[44px]" data-node-id="1:9396">
          Action
        </p>
        <div className="absolute h-0 left-[16px] top-[284px] w-[1063px]" data-node-id="1:9397">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[16px] top-[372px] w-[1063px]" data-node-id="1:9398">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[16px] top-[460px] w-[1063px]" data-node-id="1:9399">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[14px] top-[230px] w-[84px]" data-node-id="1:9400">
          #GN458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[14px] top-[320px] w-[84px]" data-node-id="1:9401">
          #GN458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[14px] top-[408px] w-[84px]" data-node-id="1:9402">
          #GN458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[14px] top-[496px] w-[84px]" data-node-id="1:9403">
          #GN458652
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[410px] not-italic text-[#422c23] text-[14px] top-[230px] w-[116px]" data-node-id="1:9404">
          rahul@gmail.com
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[597px] not-italic text-[#24a148] text-[14px] top-[230px] w-[43px]" data-node-id="1:9405">
          Active
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[733px] not-italic text-[#422c23] text-[14px] top-[230px] w-[87px]" data-node-id="1:9406">
          Super Admin
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[915px] not-italic text-[#422c23] text-[14px] top-[230px] w-[87px]" data-node-id="1:9407">
          Super Admin
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[20px] left-[915px] not-italic text-[#422c23] text-[14px] top-[318px] w-[87px]" data-node-id="1:9408">
          Super Admin
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[597px] not-italic text-[#9ca3af] text-[14px] top-[320px] w-[53px]" data-node-id="1:9409">
          Inactive
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[16px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[171px] w-[49px]" data-node-id="1:9410">
          User ID
        </p>
        <div className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[0] left-[180px] not-italic text-[#422c23] text-[14px] top-[220px] w-[120px]" data-node-id="1:9411">
          <p className="leading-[20px] mb-0">Rahul Sharma</p>
          <p className="leading-[20px] text-[#737373]">+91-9205061339</p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[180px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[171px] w-[152px]" data-node-id="1:9412">
          Name / Phone Number
        </p>
        <div className="absolute bg-[#fbf6e8] border-[#be880b] border-[0.23px] border-solid h-[28px] left-[1050px] rounded-[4px] top-[226px] w-[29px]" data-node-id="1:9413" />
        <div className="absolute bg-[#be880b] border border-[#be880b] border-solid h-[28px] left-[1050px] rounded-[4px] top-[314px] w-[29px]" data-node-id="1:9414" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+517.5px)] size-[16px] top-[calc(50%-185.5px)]" data-node-id="1:9415" data-name="Person Add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPersonAdd} />
        </div>
        <Link to="/settings/users/role-change" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+517.5px)] size-[16px] top-[calc(50%-97.5px)]" data-node-id="1:9416" data-name="Person Add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPersonAdd1} />
        </Link>
        <div className="absolute inset-[10.22%_17.18%_85.55%_66.54%]" data-node-id="1:9417" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[740px] not-italic text-[#67554d] text-[12px] top-[93px] whitespace-nowrap" data-node-id="1:9418">{`User ID `}</p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+339.5px)] size-[16px] top-[calc(50%-320.5px)]" data-node-id="1:9419" data-name="Search">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
        </div>
        <div className="absolute inset-[10.22%_1.46%_85.55%_83.91%]" data-node-id="1:9420" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds1} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[930px] not-italic text-[#422c23] text-[12px] top-[93px] whitespace-nowrap" data-node-id="1:9421">
          Status
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+511.5px)] size-[16px] top-[calc(50%-320.5px)]" data-node-id="1:9422" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron2} />
        </div>
        <div className="absolute h-0 left-[16px] top-[147px] w-[1063px]" data-node-id="1:9423">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine472} />
          </div>
        </div>
      </div>
      <Link to="/settings/users/new" className="absolute contents cursor-pointer left-[987px] top-[86px]" data-node-id="1:9424">
        <div className="absolute inset-[8.4%_22.22%_88.48%_68.54%]" data-name="Bounds">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
      </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[24px] left-[1033px] not-italic text-[14px] text-white top-[90px] whitespace-nowrap pointer-events-none" data-node-id="1:9425">
        Add User
      </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-[calc(50%+299px)] top-[calc(50%-410px)] w-[16px] pointer-events-none" data-node-id="1:9426" data-name="Add">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAdd} />
      </div>
      </Link>
    </div>
  );
}


export default function SettingsPage() {
  
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <SettingsPageInner />
      </div>
    </div>
  );
}

export function UserManagementPage({ showRolePopup = false }: { showRolePopup?: boolean }) {
  void showRolePopup;
  return <SettingsPage />;
}
