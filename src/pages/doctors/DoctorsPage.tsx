import { Link } from "react-router-dom";
import { AppLayout } from "../../layouts/AppLayout";
import { Card, PrimaryButton } from "../../components/ui";
import { samplePatients } from "../../data/mockData";
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
import imgEllipse3705 from "../../assets/appointments/ellipse2.svg";
import imgFrame from "../../assets/appointments/close.svg";
import imgGrid from "../../assets/appointments/grid.svg";
import imgGroup from "../../assets/appointments/arrow-group.svg";
import imgHeartPulse from "../../assets/appointments/heart.svg";
import imgHistory from "../../assets/appointments/history.svg";
import imgImage from "../../assets/appointments/avatar.png";
import imgLine340 from "../../assets/appointments/line340.svg";
import imgLine477 from "../../assets/appointments/line477.svg";
import imgLogo21 from "../../assets/appointments/logo.png";
import imgPerson from "../../assets/appointments/person.svg";
import imgRectangle1 from "../../assets/appointments/sidebar-bg.png";
import imgSearch from "../../assets/appointments/search.svg";
import imgSettings from "../../assets/appointments/settings.svg";
import imgLine351 from "../../assets/doctors/line351.svg";

function DoctorsPageInner() {
  return (
    <div className="bg-[#fffef7] relative size-full" data-node-id="1:6708" data-name="Doctors 1">
      <a className="absolute block cursor-pointer left-[1384px] size-[32px] top-[86px]" data-node-id="1:6709">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3704} />
      </a>
      <div className="absolute left-[1136px] size-[32px] top-[86px]" data-node-id="1:6710">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3705} />
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1368px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:6711">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[32px] items-center justify-center left-[1184px] top-[86px] w-0">
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[32px]" data-node-id="1:6712">
            <div className="absolute inset-[-0.5px_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgLine477} />
            </div>
          </div>
        </div>
      </div>
      <Link to="/dashboard/profile-dropdown" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+624px)] size-[16px] top-[calc(50%-410px)]" data-node-id="1:6713" data-name="Chevron">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron} />
      </Link>
      <div className="absolute bg-[#eee4cc] h-[38px] left-[321px] overflow-clip rounded-[10px] top-[24px] w-[1095px]" data-node-id="1:6714">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-27.5px)] top-[calc(50%+0.5px)]" data-node-id="1:6715">
          <p className="[word-break:break-word] absolute font-['Inter'] leading-[0] left-[calc(50%-300.5px)] not-italic text-[#422c23] text-[14px] top-[calc(50%-8px)] whitespace-pre" data-node-id="1:6716">
            <span className="font-['Inter'] font-medium leading-[normal]">{`Get Up to 50% Off on Ayurvedic Medicines & Wellness Products          `}</span>
            <span className="font-['Inter'] font-semibold leading-[normal] text-[#be880b]">{`  `}</span>
            <Link to="/dashboard/offer-popup" className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-from-font decoration-solid font-['Inter'] font-semibold leading-[normal] text-[#be880b] underline">Claim Offer</Link>
          </p>
        </div>
        <div className="-translate-y-1/2 absolute left-[1063px] size-[20px] top-1/2" data-node-id="1:6717" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
        <div className="absolute inset-[36.84%_35.61%_32.17%_61.72%]" data-node-id="1:6719" data-name="Group">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
      </div>
      <div className="absolute left-[1200px] size-[32px] top-[86px]" data-node-id="1:6721" data-name="Image">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="32" src={imgImage} width="32" />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#422c23] text-[13px] top-[86px] whitespace-nowrap" data-node-id="1:6722">
        Rahul Sharma
      </p>
      <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1240px] not-italic text-[#737373] text-[11px] top-[107px] whitespace-nowrap" data-node-id="1:6723">
        Super Admin
      </p>
      <Link to="/dashboard/logout-popup" className="-translate-x-1/2 -translate-y-1/2 absolute block cursor-pointer left-[calc(50%+680px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:6724" data-name="Arrow Exit">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowExit} />
      </Link>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+432px)] size-[20px] top-[calc(50%-410px)]" data-node-id="1:6725" data-name="Alert">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlert} />
      </div>
      <div className="absolute content-stretch flex items-center left-[321px] top-[93px]" data-node-id="1:6726" data-name="Breadcrumb Group">
        <div className="content-stretch flex gap-[8px] items-end relative shrink-0" data-node-id="1:6727" data-name="item 1">
          <div className="content-stretch flex items-center px-px relative shrink-0" data-node-id="I1:6727;70:24394" data-name="Link">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[18px] not-italic relative shrink-0 text-[#422c23] text-[14px] tracking-[0.16px] whitespace-nowrap" data-node-id="I1:6727;70:24394;0:7611">
              Doctors
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6728">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6729">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6730">
            Total Patients
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6732">
          30
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6733">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6734">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6735">
              <span className="leading-none text-[#be880b] text-[12px]">20</span>
              <span className="leading-none text-[12px]">{` Completed`}</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6736">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6737">
              <span className="leading-none text-[#be880b] text-[12px]">10</span>
              <span className="leading-none text-[12px]">{` Ongoing`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[599px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6738">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6739">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6740">
            Active Treatment Plans
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6742">
          30
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6743">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6744">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6745">
              <span className="leading-none text-[#be880b] text-[12px]">20</span>
              <span className="leading-none text-[12px]">{` Completed`}</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6746">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6747">
              <span className="leading-none text-[#be880b] text-[12px]">10</span>
              <span className="leading-none text-[12px]">{` Ongoing`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[1154px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6748">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6749">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6750">
            Follow Ups Due
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6752">
          9
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6753">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6754">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6755">
              <span className="leading-none text-[#be880b] text-[12px]">5</span>
              <span className="leading-none text-[12px]">{` Scheduled`}</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6756">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6757">
              <span className="leading-none text-[#be880b] text-[12px]">4</span>
              <span className="leading-none text-[12px]">{` Pending`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[132px] left-[877px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[142px] w-[262px]" data-node-id="1:6758">
        <div className="absolute bg-white content-stretch flex gap-[108px] items-start left-[16px] top-[22px] w-[153px]" data-node-id="1:6759">
          <p className="[word-break:break-word] font-['Inter'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#838a9a] text-[16px] whitespace-nowrap" data-node-id="1:6760">
            Completed Treatments
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[36px] left-[16px] not-italic text-[#422c23] text-[22px] top-[54px] whitespace-nowrap" data-node-id="1:6762">
          9
        </p>
        <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] top-[96px]" data-node-id="1:6763">
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6764">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6765">
              <span className="leading-none text-[#be880b] text-[12px]">5</span>
              <span className="leading-none text-[12px]">{` Consultation`}</span>
            </p>
          </div>
          <div className="bg-[#f7efe2] content-stretch flex h-[20px] items-center justify-center px-[8px] relative rounded-[100px] shrink-0" data-node-id="1:6766">
            <p className="[word-break:break-word] font-['Inter'] font-medium leading-[0] not-italic relative shrink-0 text-[#422c23] text-[0px] whitespace-nowrap" data-node-id="1:6767">
              <span className="leading-none text-[#be880b] text-[12px]">4</span>
              <span className="leading-none text-[12px]">{` Therapy`}</span>
            </p>
          </div>
        </div>
      </div>
      <Link to="/appointments/create-patient" className="absolute contents cursor-pointer left-[939px] top-[86px]" data-node-id="1:6768">
        <div className="absolute inset-[8.4%_22.22%_88.48%_65.21%]" data-node-id="1:6769" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[24px] left-[977px] not-italic text-[14px] text-white top-[90px] whitespace-nowrap" data-node-id="1:6770">
          Book Appointment
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14px] left-[calc(50%+243px)] top-[calc(50%-409px)] w-[16px]" data-node-id="1:6771" data-name="Add">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAdd} />
        </div>
      </Link>
      <div className="absolute bg-white h-[969px] left-[24px] overflow-clip rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-[24px] w-[273px]" data-node-id="1:6772">
        <div className="absolute contents left-0 top-0" data-node-id="I1:6772;509:17145">
          <div className="-translate-y-1/2 absolute h-[969px] left-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] top-1/2 w-[273px]" data-node-id="I1:6772;509:17146">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]">
              <div className="absolute bg-white inset-0 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px]" />
              <img alt="" className="absolute max-w-none object-cover opacity-68 rounded-bl-[24px] rounded-tl-[24px] rounded-tr-[30px] size-full" src={imgRectangle1} />
            </div>
          </div>
          <Link to="/patients" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[257px] whitespace-nowrap" data-node-id="I1:6772;509:17147">
            <p className="leading-[normal]">Patients</p>
          </Link>
          <Link to="/sales" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[577px] whitespace-nowrap" data-node-id="I1:6772;509:17148">
            <p className="leading-[normal]">Sales</p>
          </Link>
          <Link to="/activity-log" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[641px] whitespace-nowrap" data-node-id="I1:6772;509:17149">
            <p className="leading-[normal]">Activity Logs</p>
          </Link>
          <Link to="/treatments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[448px] whitespace-nowrap" data-node-id="I1:6772;509:17150">
            <p className="leading-[normal]">Treatments</p>
          </Link>
          <Link to="/billing" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[705px] whitespace-nowrap" data-node-id="I1:6772;509:17151">
            <p className="leading-[normal]">Billing</p>
          </Link>
          <Link to="/medicines" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[513px] whitespace-nowrap" data-node-id="I1:6772;509:17152">
            <p className="leading-[normal]">Medicines</p>
          </Link>
          <Link to="/settings" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[769px] whitespace-nowrap" data-node-id="I1:6772;509:17153">
            <p className="leading-[normal]">Settings</p>
          </Link>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[81px] not-italic text-[#be880b] text-[12px] top-[120px] whitespace-nowrap" data-node-id="I1:6772;509:17154">
            A Journey of Healing
          </p>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-218.5px)]" data-node-id="I1:6772;509:17155" data-name="Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+37.5px)]" data-node-id="I1:6772;509:17156" data-name="Briefcase Medical">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBriefcaseMedical} />
          </div>
          <Link to="/appointments" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[385px] whitespace-nowrap" data-node-id="I1:6772;509:17157">
            <p className="leading-[normal]">Appointments</p>
          </Link>
          <div className="-translate-x-1/2 absolute border-[#be880b] border-[0.813px] border-solid left-[calc(50%-1px)] rounded-[57.846px] size-[47px] top-[40px]" data-node-id="I1:6772;509:17158" data-name="logo (2) 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[57.846px]">
              <img alt="" className="absolute left-[-73.08%] max-w-none size-[242.31%] top-[-26.92%]" src={imgLogo21} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[46px] not-italic text-[#422c23] text-[16px] top-[97px] whitespace-nowrap" data-node-id="I1:6772;509:17159">
            GANESHA AYURVEDAA
          </p>
          <Link to="/dashboard" className="[word-break:break-word] absolute block cursor-pointer font-['Inter'] font-medium leading-[0] left-[74px] not-italic text-[#422c23] text-[16px] top-[193px] whitespace-nowrap" data-node-id="I1:6772;509:17160">
            <p className="leading-[normal]">Dashboard</p>
          </Link>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-90.5px)]" data-node-id="I1:6772;509:17161" data-name="Calendar Person">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCalendarPerson} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+293.5px)]" data-node-id="I1:6772;509:17162" data-name="Settings">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSettings} />
          </div>
          <div className="absolute bg-[#fffef7] h-[56px] left-[18px] rounded-bl-[10px] rounded-tl-[10px] top-[302px] w-[255px]" data-node-id="I1:6772;509:17163" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+165.5px)]" data-node-id="I1:6772;509:17164" data-name="History">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHistory} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+229.5px)]" data-node-id="I1:6772;509:17165" data-name="Document Bullet List">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDocumentBulletList} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%+101.5px)]" data-node-id="I1:6772;509:17166" data-name="Data Histogram">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDataHistogram} />
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-26.5px)]" data-node-id="I1:6772;509:17167" data-name="Heart Pulse">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgHeartPulse} />
          </div>
          <p className="[word-break:break-word] absolute font-['Inter'] font-semibold leading-[normal] left-[74px] not-italic text-[#be880b] text-[16px] top-[321px] whitespace-nowrap" data-node-id="I1:6772;509:17168">
            Doctors
          </p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-282.5px)]" data-node-id="I1:6772;509:17169" data-name="Grid">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGrid} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-90.5px)] size-[24px] top-[calc(50%-154.5px)]" data-node-id="I1:6772;509:17170" data-name="Doctor">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDoctor} />
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.8)] h-[696px] left-[321px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[290px] w-[1095px]" data-node-id="1:6773">
        <div className="absolute inset-[3.45%_33.24%_91.38%_50.5%]" data-node-id="1:6774" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds1} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[565px] not-italic text-[#9ca3af] text-[12px] top-[30px] whitespace-nowrap" data-node-id="1:6775">
          Search
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+163.5px)] size-[16px] top-[calc(50%-306px)]" data-node-id="1:6776" data-name="Search">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch} />
        </div>
        <div className="absolute inset-[3.45%_17.53%_91.38%_67.85%]" data-node-id="1:6777" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
        </div>
        <div className="absolute inset-[3.45%_1.46%_91.38%_83.93%]" data-node-id="1:6778" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[755px] not-italic text-[#422c23] text-[12px] top-[30px] whitespace-nowrap" data-node-id="1:6779">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[24px] left-[931px] not-italic text-[#422c23] text-[12px] top-[30px] whitespace-nowrap" data-node-id="1:6780">
          Visit type
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+335.5px)] size-[16px] top-[calc(50%-306px)]" data-node-id="1:6781" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+511.5px)] size-[16px] top-[calc(50%-305px)]" data-node-id="1:6782" data-name="Chevron">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevron1} />
        </div>
        <div className="absolute h-0 left-[16px] top-[92px] w-[1063px]" data-node-id="1:6783">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine351} />
          </div>
        </div>
        <Link to="/doctors/cancel-appointment" className="absolute bg-[#fae3e2] block border-[#dc2626] border-[0.23px] border-solid cursor-pointer h-[27px] left-[991px] rounded-[16px] top-[165px] w-[88px]" data-node-id="1:6784" />
        <Link to="/doctors/1" className="absolute bg-[#e6efe3] block border-[#036f4b] border-[0.23px] border-solid cursor-pointer h-[27px] left-[872px] rounded-[16px] top-[165px] w-[88px]" data-node-id="1:6785" />
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[1011px] not-italic text-[#dc2626] text-[14px] top-[170px] whitespace-nowrap pointer-events-none" data-node-id="1:6786">
          Cancel
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[899px] not-italic text-[#036f4b] text-[14px] top-[170px] whitespace-nowrap pointer-events-none" data-node-id="1:6787">
          Start
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:6788">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:6789">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:6790">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:6791">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:6792">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:6793">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[16px] not-italic text-[#422c23] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:6794">
          09:30 AM
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:6795">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:6796">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:6797">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:6798">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:6799">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:6800">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[215px] not-italic text-[#422c23] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:6801">
          Khushi Shroff
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[215px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:6802">
          Patient
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[16px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:6803">
          Time
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:6804">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:6805">
          Therapy
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:6806">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:6807">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:6808">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:6809">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[448px] not-italic text-[#be880b] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:6810">
          Consultation
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[447px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:6811">
          Visit Type
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[637px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:6812">
          Status
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-normal leading-[normal] left-[872px] not-italic text-[14px] text-[rgba(66,44,35,0.8)] top-[116px] whitespace-nowrap" data-node-id="1:6813">
          Action
        </p>
        <div className="absolute h-0 left-[17px] top-[216px] w-[1062px]" data-node-id="1:6814">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[291px] w-[1062px]" data-node-id="1:6815">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[366px] w-[1062px]" data-node-id="1:6816">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[441px] w-[1062px]" data-node-id="1:6817">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[516px] w-[1062px]" data-node-id="1:6818">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[591px] w-[1062px]" data-node-id="1:6819">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <div className="absolute h-0 left-[17px] top-[666px] w-[1062px]" data-node-id="1:6820">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine340} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#eab308] text-[14px] top-[170px] whitespace-nowrap" data-node-id="1:6821">
          Scheduled
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[245px] whitespace-nowrap" data-node-id="1:6822">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[320px] whitespace-nowrap" data-node-id="1:6823">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[395px] whitespace-nowrap" data-node-id="1:6824">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[470px] whitespace-nowrap" data-node-id="1:6825">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[545px] whitespace-nowrap" data-node-id="1:6826">
          Completed
        </p>
        <p className="[word-break:break-word] absolute font-['Inter'] font-medium leading-[normal] left-[637px] not-italic text-[#2e7d32] text-[14px] top-[620px] whitespace-nowrap" data-node-id="1:6827">
          Completed
        </p>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-[#fffef7]">
      <div className="relative h-[1024px] w-[1440px] shrink-0 overflow-visible">
        <DoctorsPageInner />
      </div>
    </div>
  );
}

export function DoctorDetailPage({ variant = 1, editable = false }: { variant?: number; editable?: boolean }) {
  return (
    <AppLayout title={editable ? "Edit Doctor" : "Doctor Details"}>
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Dr. Sheekha</h2>
            <p className="text-sm text-text-secondary">Ayurvedic Specialist · Vata Expert</p>
          </div>
          <div className="flex gap-2">
            {!editable && (
              <Link to={`/doctors/${variant}/edit`} className="rounded-lg border border-gold px-4 py-2 text-sm text-gold">
                Edit
              </Link>
            )}
            <PrimaryButton to="/doctors/prescription/create">Create Prescription</PrimaryButton>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section>
            <h3 className="mb-3 font-semibold text-muted">Today&apos;s Appointments</h3>
            <ul className="space-y-2 text-sm">
              {samplePatients.map((p) => (
                <li key={p.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span>{p.name}</span>
                  <span className="text-gold">{p.visitType}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-3 font-semibold text-muted">Patient Queue</h3>
            <Link to="/doctors/patient-details-changed" className="text-sm text-gold underline">
              View patient with pending changes
            </Link>
          </section>
        </div>
      </Card>
    </AppLayout>
  );
}

