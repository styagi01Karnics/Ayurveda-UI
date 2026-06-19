import { Link, useNavigate } from "react-router-dom";
import imgRectangle1 from "../../assets/signup/bg.png";
import img7591Fc220Fd4D8861E092B7D5E5997C82 from "../../assets/signup/tulsi.png";
import imgLogo21 from "../../assets/signup/logo.png";
import imgFrame1149 from "../../assets/signup/avatar.png";
import img47384Bbb6Cb6C3B72F9F27676Ca317B21 from "../../assets/signup/spices.png";
import imgVector679 from "../../assets/signup/divider.png";
import imgEllipse203 from "../../assets/signup/status-dot.png";
import imgDownload from "../../assets/signup/download.png";
import imgLine475 from "../../assets/signup/line475.png";
import imgFrame from "../../assets/signup/chevron.png";
import imgLine476 from "../../assets/signup/line476.png";

export default function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-auto bg-white">
      <div className="relative h-[1642px] w-[1440px] shrink-0 overflow-visible">
        <div className="relative size-full" data-node-id="1:16469" data-name="Sign Up">
          <div className="-translate-y-1/2 absolute h-[2106px] left-0 top-[calc(50%-95px)] w-[1536px]" data-node-id="1:16470">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <div className="absolute bg-white inset-0" />
              <div className="absolute inset-0 opacity-68 overflow-hidden">
                <img alt="" className="absolute h-[111.73%] left-0 max-w-none top-[-11.73%] w-full" src={imgRectangle1} />
              </div>
            </div>
          </div>
          <div className="absolute flex h-[322.101px] items-center justify-center left-[calc(80%+96px)] top-[-115px] w-[375.56px]">
            <div className="flex-none rotate-[-118.77deg]">
              <div className="h-[324.524px] relative w-[189.272px]" data-node-id="1:16471">
                <img alt="" className="absolute inset-0 max-w-none object-cover opacity-50 pointer-events-none size-full" src={img7591Fc220Fd4D8861E092B7D5E5997C82} />
              </div>
            </div>
          </div>
          <div className="absolute bg-[rgba(255,255,255,0.8)] h-[1404px] left-[80px] overflow-clip rounded-[11.752px] shadow-[0px_0px_3.526px_1.175px_rgba(190,136,11,0.1)] top-[139px] w-[1159px]" data-node-id="1:16472">
            <div className="absolute content-stretch flex h-[62.405px] items-start left-[31.61px] top-[200.96px]" data-node-id="1:16473">
              <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[normal] not-italic relative shrink-0 text-[#422c23] text-[37.607px] whitespace-nowrap" data-node-id="1:16474">
                Let&apos;s Begin
              </p>
            </div>
            <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium h-[31.202px] leading-[normal] left-[31.61px] not-italic text-[#737373] text-[18.803px] top-[263.37px] w-[437.179px]" data-node-id="1:16475">
              Enter your Credentials to create admin account
            </p>
            <div className="absolute contents left-[438px] top-[1287.78px]" data-node-id="1:16480">
              <Link to="/login" className="[word-break:break-word] absolute block cursor-pointer font-['Poppins:Medium'] h-[54.03px] leading-[0] left-[438px] not-italic text-[#422c23] text-[0px] top-[1287.78px] w-[283.124px]" data-node-id="1:16481">
                <p className="font-['Inter:Medium'] font-medium text-[16.453px] whitespace-pre-wrap">
                  <span className="leading-[normal]">{`Already have an account?  `}</span>
                  <span className="leading-[normal] text-[#be880b]">Login</span>
                </p>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="-translate-x-1/2 absolute h-[65.782px] left-[calc(50%+19.89px)] top-[1181.81px] w-[488.786px] cursor-pointer border-0 bg-transparent p-0"
              data-node-id="1:16482"
            >
              <div className="absolute content-stretch flex flex-col items-start left-0 top-0 w-[474.786px]" data-node-id="1:16483">
                <div className="bg-[#be880b] border-[#be880b] border-[1.175px] border-solid content-stretch flex h-[37.607px] items-center overflow-clip pl-[11.752px] py-[11.752px] relative rounded-[10px] shrink-0 w-[474.786px]" data-node-id="I1:16483;104:930">
                  <div className="content-stretch flex h-[17.628px] items-start justify-center relative shrink-0 w-[36.432px]" data-node-id="I1:16483;109:202" />
                </div>
              </div>
              <p className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[209px] not-italic text-[16.453px] text-white top-[9.4px] whitespace-nowrap pointer-events-none" data-node-id="1:16484">
                Signup
              </p>
            </button>
            <div className="-translate-x-1/2 absolute contents left-[calc(50%+0.5px)] top-[42.31px]" data-node-id="1:16485">
              <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[514.13px] not-italic text-[#be880b] text-[14.103px] top-[136.32px] whitespace-nowrap" data-node-id="1:16486">
                A Journey of Healing
              </p>
              <div className="-translate-x-1/2 absolute border-[#be880b] border-[0.956px] border-solid left-[calc(50%-1.32px)] rounded-[67.982px] size-[55.235px] top-[42.31px]" data-node-id="1:16487">
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[67.982px]">
                  <img alt="" className="absolute left-[-73.08%] max-w-none size-[242.31%] top-[-26.92%]" src={imgLogo21} />
                </div>
              </div>
              <p className="[word-break:break-word] absolute font-['Inter:Semi_Bold'] font-semibold leading-[normal] left-[473px] not-italic text-[#422c23] text-[18.803px] top-[109.29px] whitespace-nowrap" data-node-id="1:16488">
                GANESHA AYURVEDAA
              </p>
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.8)] h-[414px] left-[32px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[327px] w-[1095px]" data-node-id="1:16489">
              <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[1.5] left-[16px] not-italic text-[14px] text-[#737373] top-[46px] whitespace-nowrap" data-node-id="1:16490">
                Basic Information about your company
              </p>
              <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[18px] top-[16px] whitespace-nowrap" data-node-id="1:16491">
                Clinic Information
              </p>
              <div className="absolute h-0 left-[745px] top-[123px] w-[334px]" data-node-id="1:16492">
                <div className="absolute inset-[-0.5px_0]">
                  <img alt="" className="block max-w-none size-full" src={imgVector679} />
                </div>
              </div>
              <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[745px] not-italic text-[#404040] text-[12px] top-[99px] whitespace-nowrap" data-node-id="1:16493">
                Your Logo
              </p>
              <div className="absolute h-[250px] left-[745px] top-[149px] w-[334px]" data-node-id="1:16494">
                <div className="absolute content-stretch flex gap-[10px] items-center left-0 top-[-10px]" data-node-id="1:16495">
                  <div className="relative shrink-0 size-[28px]" data-node-id="I1:16495;1251:2346">
                    <div className="absolute left-0 rounded-[21px] size-[28px] top-0" data-node-id="I1:16495;1251:2347">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[21px] size-full" src={imgFrame1149} />
                    </div>
                    <div className="absolute left-[22.4px] size-[4.9px] top-[18.9px]" data-node-id="I1:16495;1251:2348">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse203} />
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 whitespace-nowrap" data-node-id="I1:16495;1251:2349">
                    <p className="font-['Inter:Medium'] font-medium leading-[normal] relative shrink-0 text-[#3a3541] text-[13px]" data-node-id="I1:16495;1251:2350">
                      Edit your Logo
                    </p>
                    <p className="font-['Lato:Regular'] leading-[0] relative shrink-0 text-[#727272] text-[0px]" data-node-id="I1:16495;1251:2351">
                      <span className="font-['Inter:Medium'] font-medium leading-[normal] text-[11px]">{`Delete `}</span>
                      <span className="font-['Inter:Medium'] font-medium leading-[normal] text-[#be880b] text-[11px]">Update</span>
                    </p>
                  </div>
                </div>
                <div className="absolute border border-[#be880b] border-dashed h-[211px] left-0 overflow-clip rounded-[8px] top-[39px] w-[334px]" data-node-id="1:16496">
                  <div className="absolute h-[105px] left-[59px] top-[52px] w-[212px]" data-node-id="1:16497">
                    <div className="absolute left-[90px] size-[32px] top-0" data-node-id="1:16498">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDownload} />
                    </div>
                    <div className="absolute content-stretch flex items-start left-0 overflow-clip px-[17px] py-[6px] top-[48px]" data-node-id="1:16501">
                      <div className="[word-break:break-word] font-['Lato:Regular'] leading-[0] not-italic relative shrink-0 text-[#be880b] text-[0px] text-center whitespace-nowrap" data-node-id="I1:16501;1281:3725">
                        <p className="font-['Inter:Medium'] font-medium mb-0 text-[13px]">
                          <span className="leading-[normal]">{`Click to upload `}</span>
                          <span className="leading-[normal] text-[#3a3541]">or drag and drop</span>
                        </p>
                        <p className="font-['Inter:Medium'] font-medium leading-[normal] mb-0 text-[#3a3541] text-[13px]">SVG, PNG, JPG or GIF</p>
                        <p className="font-['Inter:Medium'] font-medium leading-[normal] text-[#89868d] text-[13px]">(max, 800x400px)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[99px] w-[332px]" data-node-id="1:16502">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[12px] w-[182px]" data-node-id="1:16503">
                  <p className="leading-[normal] whitespace-pre-wrap">{`Clinic  Name`}</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16504">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16505">
                    Clinic Name
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[258px] w-[332px]" data-node-id="1:16506">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16507">
                  <p className="leading-[normal]">Address Line 1</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16508">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16509">
                    Address Line 1
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[338px] w-[332px]" data-node-id="1:16510">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16511">
                  <p className="leading-[normal]">Registration Number/ GST</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16512">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16513">
                    Registration Number/ GST
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[480px] top-[179px] w-[217px]" data-node-id="1:16514">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16515">
                  <p className="leading-[normal]">PIN Code</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16516">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16517">
                    PIN Code
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[364px] top-[99px] w-[332px]" data-node-id="1:16518">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16519">
                  <p className="leading-[normal]">Clinic Type</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16520">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16521">
                    Clinic Type
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[364px] top-[258px] w-[332px]" data-node-id="1:16522">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16523">
                  <p className="leading-[normal]">Address Line 2</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16524">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16525">
                    Address Line 2
                  </p>
                </div>
              </div>
              <div className="absolute flex h-[300px] items-center justify-center left-[721px] top-[99px] w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[300px]" data-node-id="1:16526">
                    <div className="absolute inset-[-0.5px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine475} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[179px] w-[216px]" data-node-id="1:16527">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:16528">
                  <p className="leading-[normal]">State</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16529">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16530">
                    Select State
                  </p>
                  <div className="relative shrink-0 size-[20px]" data-node-id="1:16531">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[248px] top-[179px] w-[216px]" data-node-id="1:16533">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] whitespace-nowrap" data-node-id="1:16534">
                  <p className="leading-[normal]">City</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16535">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16536">
                    Select City
                  </p>
                  <div className="relative shrink-0 size-[20px]" data-node-id="1:16537">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bg-[rgba(255,255,255,0.8)] h-[373px] left-[32px] overflow-clip rounded-[10px] shadow-[0px_0px_3px_1px_rgba(190,136,11,0.1)] top-[761px] w-[1095px]" data-node-id="1:16539">
              <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[1.5] left-[16px] not-italic text-[14px] text-[#737373] top-[46px] whitespace-nowrap" data-node-id="1:16540">
                Primary contact information for your company
              </p>
              <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[20px] left-[16px] not-italic text-[#422c23] text-[18px] top-[16px] whitespace-nowrap" data-node-id="1:16541">
                Contact Information
              </p>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[99px] w-[332px]" data-node-id="1:16542">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[12px] w-[182px]" data-node-id="1:16543">
                  <p className="leading-[normal]">Full Name</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16544">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16545">
                    Full Name
                  </p>
                </div>
              </div>
              <div className="absolute flex h-[258px] items-center justify-center left-[721px] top-[99px] w-0">
                <div className="flex-none rotate-90">
                  <div className="h-0 relative w-[258px]" data-node-id="1:16546">
                    <div className="absolute inset-[-0.5px_0_0_0]">
                      <img alt="" className="block max-w-none size-full" src={imgLine476} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute h-0 left-[745px] top-[123px] w-[334px]" data-node-id="1:16547">
                <div className="absolute inset-[-0.5px_0]">
                  <img alt="" className="block max-w-none size-full" src={imgVector679} />
                </div>
              </div>
              <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium leading-[normal] left-[745px] not-italic text-[#404040] text-[12px] top-[99px] whitespace-nowrap" data-node-id="1:16548">
                Your Photo
              </p>
              <div className="absolute content-stretch flex gap-[10px] items-center left-[745px] top-[139px]" data-node-id="1:16549">
                <div className="relative shrink-0 size-[28px]" data-node-id="I1:16549;1251:2346">
                  <div className="absolute left-0 rounded-[21px] size-[28px] top-0" data-node-id="I1:16549;1251:2347">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[21px] size-full" src={imgFrame1149} />
                  </div>
                  <div className="absolute left-[22.4px] size-[4.9px] top-[18.9px]" data-node-id="I1:16549;1251:2348">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse203} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 whitespace-nowrap" data-node-id="I1:16549;1251:2349">
                  <p className="font-['Inter:Medium'] font-medium leading-[normal] relative shrink-0 text-[#3a3541] text-[13px]" data-node-id="I1:16549;1251:2350">
                    Edit your photo
                  </p>
                  <p className="font-['Lato:Regular'] leading-[0] relative shrink-0 text-[#727272] text-[0px]" data-node-id="I1:16549;1251:2351">
                    <span className="font-['Inter:Medium'] font-medium leading-[normal] text-[11px]">{`Delete `}</span>
                    <span className="font-['Inter:Medium'] font-medium leading-[normal] text-[#be880b] text-[11px]">Update</span>
                  </p>
                </div>
              </div>
              <div className="absolute border border-[#be880b] border-dashed h-[169px] left-[745px] overflow-clip rounded-[8px] top-[188px] w-[334px]" data-node-id="1:16550">
                <div className="absolute h-[105px] left-[59px] top-[31px] w-[212px]" data-node-id="1:16551">
                  <div className="absolute left-[90px] size-[32px] top-0" data-node-id="1:16552">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDownload} />
                  </div>
                  <div className="absolute content-stretch flex items-start left-0 overflow-clip px-[17px] py-[6px] top-[48px]" data-node-id="1:16555">
                    <div className="[word-break:break-word] font-['Lato:Regular'] leading-[0] not-italic relative shrink-0 text-[#be880b] text-[0px] text-center whitespace-nowrap" data-node-id="I1:16555;1281:3725">
                      <p className="font-['Inter:Medium'] font-medium mb-0 text-[13px]">
                        <span className="leading-[normal]">{`Click to upload `}</span>
                        <span className="leading-[normal] text-[#3a3541]">or drag and drop</span>
                      </p>
                      <p className="font-['Inter:Medium'] font-medium leading-[normal] mb-0 text-[#3a3541] text-[13px]">SVG, PNG, JPG or GIF</p>
                      <p className="font-['Inter:Medium'] font-medium leading-[normal] text-[#89868d] text-[13px]">(max, 800x400px)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[364px] top-[99px] w-[332px]" data-node-id="1:16556">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16557">
                  <p className="leading-[normal]">Mobile Number</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16558">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16559">
                    Mobile Number
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[364px] top-[179px] w-[332px]" data-node-id="1:16560">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16561">
                  <p className="leading-[normal]">User ID</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16562">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16563">
                    User ID
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[179px] w-[332px]" data-node-id="1:16564">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16565">
                  <p className="leading-[normal]">Email</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16566">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16567">
                    Email
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[16px] top-[259px] w-[332px]" data-node-id="1:16568">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16569">
                  <p className="leading-[normal]">Password</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16570">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[12px] text-[#737373]" data-node-id="1:16571">
                    Password
                  </p>
                </div>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[8px] items-start justify-center left-[364px] top-[259px] w-[332px]" data-node-id="1:16572">
                <div className="[word-break:break-word] flex flex-col font-['Inter:Medium'] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[#404040] w-[182px]" data-node-id="1:16573">
                  <p className="leading-[normal]">Confirm Password</p>
                </div>
                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex h-[36px] items-center px-[10px] py-[6px] relative rounded-[4px] shrink-0 w-full" data-node-id="1:16574">
                  <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-[#737373] whitespace-nowrap" data-node-id="1:16575">
                    <span className="leading-[normal]">{`Confirm `}</span>
                    <span className="leading-[normal]">Password</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute h-[343px] left-[calc(70%+125px)] top-[1371px] w-[514px]" data-node-id="1:16576">
            <img alt="" className="absolute inset-0 max-w-none object-cover opacity-50 pointer-events-none size-full" src={img47384Bbb6Cb6C3B72F9F27676Ca317B21} />
          </div>
        </div>
      </div>
    </div>
  );
}
