import { Link } from "react-router-dom";
import imgAdd from "../../assets/appointments/add.svg";
import imgAlert from "../../assets/appointments/alert.svg";
import imgArrowExit from "../../assets/appointments/arrow-exit.svg";
import imgBounds from "../../assets/appointments/book-btn-bg.svg";
import imgBounds1 from "../../assets/appointments/search-bg.svg";
import imgBounds2 from "../../assets/appointments/filter-bg.svg";
import imgBriefcaseMedical from "../../assets/appointments/briefcase.svg";
import imgCalendarPerson from "../../assets/appointments/calendar-person.svg";
import imgChevron from "../../assets/appointments/chevron.svg";
import imgChevron1 from "../../assets/appointments/chevron1.svg";
import imgDataHistogram from "../../assets/appointments/histogram.svg";
import imgDoctor from "../../assets/appointments/doctor.svg";
import imgDocumentBulletList from "../../assets/appointments/document.svg";
import imgEllipse3704 from "../../assets/appointments/ellipse.svg";
import imgFrame from "../../assets/appointments/close.svg";
import imgGrid from "../../assets/appointments/grid.svg";
import imgGroup from "../../assets/appointments/arrow-group.svg";
import imgHeartPulse from "../../assets/appointments/heart.svg";
import imgHistory from "../../assets/appointments/history.svg";
import imgImage from "../../assets/appointments/avatar.png";
import imgLine340 from "../../assets/appointments/line340.svg";
import imgLine351 from "../../assets/doctors/line351.svg";
import imgLine477 from "../../assets/appointments/line477.svg";
import imgLogo21 from "../../assets/appointments/logo.png";
import imgPerson from "../../assets/appointments/person.svg";
import imgRectangle1 from "../../assets/appointments/sidebar-bg.png";
import imgSearch from "../../assets/appointments/search.svg";
import imgSettings from "../../assets/appointments/settings.svg";
import imgTrash01 from "../../assets/doctors/trash01.svg";
import imgXClose from "../../assets/doctors/x-close.svg";


function CancelAppointmentPopupInner() {
  return (
    <div className="bg-[#fffef7] relative size-full" data-node-id="1:6949" data-name="Cancel Appoinment Pop Up">
      <div className="absolute left-[1384px] size-[32px] top-[86px]" data-node-id="1:6950">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </div>
      <div className="absolute left-[1136px] size-[32px] top-[86px]" data-node-id="1:6951">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1368px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:6952">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1184px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:6953">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <Link to="/dashboard/profile-dropdown" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+624px)] size-[16px] top-[calc(50%-410px)]" data-node-id="1:6954" data-name="Chevron">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron} />
      </Link>
      <div className="absolute bg-[#eee4cc] h-[38px] left-[321px] overflow-clip rounded-[10px] top-[24px] w-[1095px]" data-node-id="1:6955">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-27.5px)] top-[calc(50%+0.5px)]" data-node-id="1:6956">
          <p className="[word-break:break-word] absolute font-['Inter'] leading-[0] left-[calc(50%-300.5px)] not-italic text-[#422c23] text-[14px] top-[calc(50%-8px)] whitespace-pre" data-node-id="1:6957">
            <span className="font-['Inter'] font-medium leading-[normal]">{`Get Up to 50% Off on Ayurvedic Medicines & Wellness Products          `}</span>
            <span className="font-['Inter'] font-semibold leading-[normal] text-[#be880b]">{`  `}</span>
            <Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>
          </p>
        </div>
        <div className="-translate-y-1/2 absolute left-[1063px] size-[20px] top-1/2" data-node-id="1:6958" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
        <div className="absolute inset-[36.84%_35.61%_32.17%_61.72%]" data-node-id="1:6960" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
      </div>
      <div className="absolute left-[1200px] size-[32px] top-[86px]" data-node-id="1:6962" data-name="Image">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="32" src={imgImage} width="32" />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#422c23] text-[13px] top-[86px] whitespace-nowrap" data-node-id="1:6963">
        Rahul Sharma
      </p>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#737373] text-[11px] top-[107px] whitespace-nowrap" data-node-id="1:6964">
        Super Admin
      </p>
      <Link to="/dashboard/logout-popup" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+680px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:6965" data-name="Arrow Exit">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowExit} />
      </Link>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+432px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:6966" data-name="Alert">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlert} />
      </div>
      <div className="absolute content-stretch flex items-center left-[321px] top-[93px]" data-node-id="1:6967" data-name="Breadcrumb Group">
        <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-node-id="1:6968" data-name="item 1">
          <div className="content-stretch flex items-center px-px relative shrink-0" data-node-id="I1:6968;70:24394" data-name="Link">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:6968;70:24394;0:7611">Doctors</p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6969">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6970">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6971">
            Total Patients
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6973">
          30
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6974">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6975">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6976">
              <span className="leading-none text-[#be880b] text-[12px]">20</span>
              <span className="leading-none text-[12px]">{` Completed`}</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6977">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6978">
              <span className="leading-none text-[#be880b] text-[12px]">10</span>
              <span className="leading-none text-[12px]">{` Ongoing`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[599px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6979">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6980">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6981">
            Active Treatment Plans
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6983">
          30
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6984">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6985">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6986">
              <span className="leading-none text-[#be880b] text-[12px]">20</span>
              <span className="leading-none text-[12px]">{` Completed`}</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6987">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6988">
              <span className="leading-none text-[#be880b] text-[12px]">10</span>
              <span className="leading-none text-[12px]">{` Ongoing`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[1154px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6989">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6990">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6991">
            Follow Ups Due
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6993">
          9
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6994">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6995">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6996">
              <span className="leading-none text-[#be880b] text-[12px]">5</span>
              <span className="leading-none text-[12px]">{` `}</span>
              <span className="leading-none text-[12px]">Schedule</span>
              <span className="leading-none text-[12px]">d</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6997">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6998">
              <span className="leading-none text-[#be880b] text-[12px]">4</span>
              <span className="leading-none text-[12px]">{` `}</span>
              <span className="leading-none text-[12px]">Pending</span>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[877px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6999">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:7000">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:7001">
            Completed Treatments
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:7003">
          9
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:7004">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:7005">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:7006">
              <span className="leading-none text-[#be880b] text-[12px]">5</span>
              <span className="leading-none text-[12px]">{` C`}</span>
              <span className="leading-none text-[12px]">onsultation</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:7007">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:7008">
              <span className="leading-none text-[#be880b] text-[12px]">4</span>
              <span className="leading-none text-[12px]">{` `}</span>
              <span className="leading-none text-[12px]">Therapy</span>
            </p>
          </div>
        </div>
      </div>
      <Link to="/appointments/create-patient" className="absolute contents cursor-pointer left-[939px] top-[86px]" data-node-id="1:7009">
        <div className="absolute inset-[8.4%_22.22%_88.48%_65.21%]" data-node-id="1:7010" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[24px] left-[977px] not-italic text-[14px] text-white top-[90px] whitespace-nowrap" data-node-id="1:7011">
          Book Appointment
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-[calc(50%+243px)] top-[calc(50%-409px)] w-[16px]" data-node-id="1:7012" data-name="Add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAdd} />
        </div>
      </Link>
      <div className="absolute bg-white h-[969px] left-[24px] overflow-clip rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-[24px] w-[273px]" data-node-id="1:7013">
        <div className="absolute contents left-0 top-0" data-node-id="I1:7013;509:17145">
          <div className="-translate-y-1/2 absolute h-[969px] left-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-1/2 w-[273px]" data-node-id="I1:7013;509:17146">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]">
              <div className="absolute bg-white inset-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]" />
              <img alt="" className="absolute max-w-none object-cover opacity-68 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] size-full" src={imgRectangle1} />
            </div>
          </div>
          <Link to="/patients" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[257px] whitespace-nowrap" data-node-id="I1:7013;509:17147"><p className="leading-[normal]">Patients</p></Link>
          <Link to="/sales" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[577px] whitespace-nowrap" data-node-id="I1:7013;509:17148"><p className="leading-[normal]">Sales</p></Link>
          <Link to="/activity-log" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[641px] whitespace-nowrap" data-node-id="I1:7013;509:17149"><p className="leading-[normal]">Activity Logs</p></Link>
          <Link to="/treatments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[448px] whitespace-nowrap" data-node-id="I1:7013;509:17150"><p className="leading-[normal]">Treatments</p></Link>
          <Link to="/billing" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[705px] whitespace-nowrap" data-node-id="I1:7013;509:17151"><p className="leading-[normal]">Billing</p></Link>
          <Link to="/medicines" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[513px] whitespace-nowrap" data-node-id="I1:7013;509:17152"><p className="leading-[normal]">Medicines</p></Link>
          <Link to="/settings" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[769px] whitespace-nowrap" data-node-id="I1:7013;509:17153"><p className="leading-[normal]">Settings</p></Link>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[81px] not-italic text-[#be880b] text-[12px] top-[120px] whitespace-nowrap" data-node-id="I1:7013;509:17154">
            A Journey of Healing
          </p>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-218.5px)]" data-node-id="I1:7013;509:17155" data-name="Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+37.5px)]" data-node-id="I1:7013;509:17156" data-name="Briefcase Medical">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBriefcaseMedical} />
          </div>
          <Link to="/appointments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[385px] whitespace-nowrap" data-node-id="I1:7013;509:17157"><p className="leading-[normal]">Appointments</p></Link>
          <div className="-translate-x-1/2 absolute border-[#be880b] border-[0.813px] border-solid left-[calc(50%-1px)] rounded-[57.846px] size-[47px] top-[40px]" data-node-id="I1:7013;509:17158" data-name="logo (2) 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[57.846px]">
              <img alt="" className="absolute left-[-73.08%] max-w-none size-[242.31%] top-[-26.92%]" src={imgLogo21} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[46px] not-italic text-[#422c23] text-[16px] top-[97px] whitespace-nowrap" data-node-id="I1:7013;509:17159">
            GANESHA AYURVEDAA
          </p>
          <Link to="/dashboard" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[normal] left-[74px] not-italic text-[#422c23] text-[16px] top-[193px] whitespace-nowrap" data-node-id="I1:7013;509:17160"><p className="leading-[normal]">Dashboard</p></Link>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-90.5px)]" data-node-id="I1:7013;509:17161" data-name="Calendar Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendarPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+293.5px)]" data-node-id="I1:7013;509:17162" data-name="Settings">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSettings} />
          </div>
          <div className="absolute bg-[#fffef7] h-[56px] left-[18px] rounded-bl-[10px] rounded-tl-[10px] top-[302px] w-[255px]" data-node-id="I1:7013;509:17163" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+165.5px)]" data-node-id="I1:7013;509:17164" data-name="History">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHistory} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+229.5px)]" data-node-id="I1:7013;509:17165" data-name="Document Bullet List">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDocumentBulletList} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+101.5px)]" data-node-id="I1:7013;509:17166" data-name="Data Histogram">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDataHistogram} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-26.5px)]" data-node-id="I1:7013;509:17167" data-name="Heart Pulse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeartPulse} />
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[74px] not-italic text-[#be880b] text-[16px] top-[321px] whitespace-nowrap" data-node-id="I1:7013;509:17168">
            Doctors
          </p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-282.5px)]" data-node-id="I1:7013;509:17169" data-name="Grid">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGrid} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-154.5px)]" data-node-id="I1:7013;509:17170" data-name="Doctor">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoctor} />
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[696px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[290px] w-[1095px]" data-node-id="1:7014">
        <div className="absolute inset-[3.45%_33.24%_91.38%_50.5%]" data-node-id="1:7015" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds1} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[565px] not-italic text-[#9ca3af] text-[12px] top-[30px] whitespace-nowrap" data-node-id="1:7016">
          Search
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+163.5px)] size-[16px] top-[calc(50%-306px)]" data-node-id="1:7017" data-name="Search">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
        </div>
        <div className="absolute inset-[3.45%_17.53%_91.38%_67.85%]" data-node-id="1:7018" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
        </div>
        <div className="absolute inset-[3.45%_1.46%_91.38%_83.93%]" data-node-id="1:7019" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[755px] not-italic text-[#422c23] text-[12px] top-[30px] whitespace-nowrap" data-node-id="1:7020">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[931px] not-italic text-[#422c23] text-[12px] top-[30px] whitespace-nowrap" data-node-id="1:7021">
          Visit type
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+335.5px)] size-[16px] top-[calc(50%-306px)]" data-node-id="1:7022" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+511.5px)] size-[16px] top-[calc(50%-305px)]" data-node-id="1:7023" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="absolute h-0 left-[16px] top-[92px] w-[1063px]" data-node-id="1:7024">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine351} />
          </div>
        </div>
        <div className="absolute bg-[#fae3e2] border-[#dc2626] border-[0.23px] border-solid h-[27px] left-[991px] rounded-[16px] top-[165px] w-[88px]" data-node-id="1:7025" />
        <div className="absolute bg-[#e6efe3] border-[#036f4b] border-[0.23px] border-solid h-[27px] left-[872px] rounded-[16px] top-[165px] w-[88px]" data-node-id="1:7026" />
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1011px] not-italic text-[#dc2626] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:7027">
          Cancel
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[899px] not-italic text-[#036f4b] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:7028">
          Start
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:7029">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:7030">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:7031">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:7032">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:7033">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:7034">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:7035">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:7036">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:7037">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:7038">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:7039">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:7040">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:7041">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:7042">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[215px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:7043">
          Patient
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[16px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:7044">
          Time
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:7045">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:7046">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:7047">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:7048">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:7049">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:7050">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:7051">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[447px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:7052">
          Visit Type
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[637px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:7053">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[872px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:7054">
          Action
        </p>
        <div className="absolute h-0 left-[17px] top-[216px] w-[1062px]" data-node-id="1:7055">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[291px] w-[1062px]" data-node-id="1:7056">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[366px] w-[1062px]" data-node-id="1:7057">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[441px] w-[1062px]" data-node-id="1:7058">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[516px] w-[1062px]" data-node-id="1:7059">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[591px] w-[1062px]" data-node-id="1:7060">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[666px] w-[1062px]" data-node-id="1:7061">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#eab308] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:7062">
          Scheduled
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:7063">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:7064">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:7065">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:7066">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:7067">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:7068">
          Completed
        </p>
      </div>
      <div className="absolute z-40 bg-[rgba(49,49,49,0.45)] h-[1024px] left-0 top-0 w-[1440px]" data-node-id="1:7069" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute z-50 bg-white content-stretch flex flex-col h-[251px] items-center left-1/2 overflow-clip rounded-[16px] shadow-[0px_20px_24px_-4px_rgba(0,0,0,0.1),0px_8px_8px_-4px_rgba(0,0,0,0.04)] top-[calc(50%+0.5px)] w-[400px]" data-node-id="1:7070" data-name="Modal">
        <div className="bg-white content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="1:7071" data-name="Modal header">
          <div className="bg-white content-stretch flex flex-col h-[76px] items-start pt-[24px] px-[24px] relative shrink-0 w-full" data-node-id="1:7072" data-name="Content">
            <div className="-translate-x-1/2 absolute bg-[#fee4e2] border-8 border-[#fef3f2] border-solid left-1/2 rounded-[28px] size-[48px] top-[24px]" data-node-id="1:7073" data-name="Featured icon">
              <div className="absolute left-[8px] size-[24px] top-[8px]" data-node-id="1:7074" data-name="trash-01">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTrash01} />
              </div>
            </div>
          </div>
          <Link to="/doctors" className="absolute content-stretch flex items-center justify-center overflow-clip p-[10px] right-[16px] rounded-[8px] top-[16px] cursor-pointer" data-node-id="1:7076" data-name="Button close X">
            <div className="relative shrink-0 size-[24px]" data-node-id="1:7077" data-name="x-close">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgXClose} />
            </div>
          </Link>
          </div>
        <div className="content-stretch flex flex-col h-[175px] items-start pt-[18px] relative shrink-0 w-full" data-node-id="1:7079" data-name="Modal actions">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 text-center w-full" data-node-id="1:7080" data-name="Text and supporting text">
            <p className="font-['Inter'] font-semibold leading-[28px] relative shrink-0 text-[#171717] text-[18px] w-full" data-node-id="1:7081">
              Cancel Appointment
            </p>
            <p className="font-['Inter'] font-normal leading-[20px] relative shrink-0 text-[#525252] text-[14px] w-full" data-node-id="1:7082">
              Are you sure you want to delete this appointment?
            </p>
          </div>
          <div className="absolute content-stretch cursor-pointer flex gap-[12px] items-start left-0 pb-[24px] px-[24px] top-[102px] w-[400px]" data-node-id="1:7083" data-name="Content">
            <Link to="/doctors" className="bg-white border border-[#d4d4d4] border-solid content-stretch flex flex-[1_0_0] items-center justify-center min-w-px overflow-clip px-[18px] py-[10px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" data-node-id="1:7084" data-name="Button">
              <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[24px] not-italic relative shrink-0 text-[#404040] text-[16px] text-left whitespace-nowrap" data-node-id="1:7085">
                Cancel
              </p>
            </Link>
            <Link to="/doctors" className="bg-[#dc2626] border border-[#be880b] border-solid content-stretch flex flex-[1_0_0] items-center justify-center min-w-px overflow-clip px-[18px] py-[10px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" data-node-id="1:7086" data-name="Button">
              <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-left text-white whitespace-nowrap" data-node-id="1:7087">
                Delete
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CancelAppointmentPopupPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <CancelAppointmentPopupInner />
      </div>
    </div>
  );
}

export { CancelAppointmentPopupPage as CancelAppointmentPopup };
