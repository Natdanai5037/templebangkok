// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import ReactLoading from "react-loading";
import Swal from 'sweetalert2'


function App() {
    const api_url = "https://first_micro-1-k4453094.deta.app/province?province=";
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [data_search, setData_search] = useState([]);

    function checkbox_change(e){
        if(e.target.checked === true){
            setLoading(true);
            fetch(api_url+e.target.id, {
                method : "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            })
            .then(response => response.json())
            .then(result => {
                setData(current => [...current, {province : result.province, temple : result.temple}])
                setLoading(false);
                
            })
            .catch((error) => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    text: error,
                    width: 400,
                    confirmButtonColor: '#F8B148',
                });
                document.getElementById(e.target.id).checked = false;
            });
        } 
        else {
            setData(current => [...current.filter((value) => value.province !== e.target.id)])
        }
    }

    function province_search(e){
        e.preventDefault();
        setLoading(true);
        const province_list = document.getElementsByClassName("province-list")[0];
        let comp = false;
        
        for (let index = 0; index < province_list.children.length; index++) {
            const element = province_list.children[index];
            if(e.target.search.value === element.innerText){
                if(document.getElementById(element.innerText).checked === false){
                    document.getElementById(element.innerText).checked = true;
                    fetch(api_url+element.innerText, {
                        method : "GET",
                        headers: {
                            'Accept': 'application/json, text/plain',
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                    })
                    .then(response => response.json())
                    .then(result => {
                        setData(current => [...current, {province : result.province, temple : result.temple}])
                        setLoading(false);
                        
                    })
                    .catch((error) => {
                        setLoading(false);
                        Swal.fire({
                            icon: 'error',
                            text: error,
                            width: 400,
                            confirmButtonColor: '#F8B148',
                        });
                        document.getElementById(e.target.id).checked = false;
                    });
                }
                else{
                    Swal.fire({
                        icon: 'warning',
                        text: "จังหวัดที่ค้นหาถูกแสดงอยู่",
                        width: 400,
                        confirmButtonColor: '#F8B148',
                    });
                    setLoading(false);
                }
                comp = true;
                break;
            }
        }

        if(data_search.length > 0){
            if(e.target.search.value === data_search[0].province){
                Swal.fire({
                    icon: 'warning',
                    text: "จังหวัดที่ค้นหาถูกแสดงอยู่",
                    width: 400,
                    confirmButtonColor: '#F8B148',
                });
                setLoading(false);
                comp = true;
            }
        }

        if(!comp){
            fetch(api_url+e.target.search.value, {
                method : "GET",
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            })
            .then(response => response.json())
            .then(result => {
                if(result.temple.length !== 0){
                    setData_search(current => [{province : result.province, temple : result.temple}])
                    setLoading(false);
                }
                else{
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        text: 'ไม่พบจังหวัดที่คุณค้นหา...',
                        width: 400,
                        confirmButtonColor: '#F8B148',
                    })
                }
                
            })
            .catch((error) => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!!!',
                    text: error,
                    width: 400,
                    confirmButtonColor: '#F8B148',
                });
            });
        }
    }

    function toggle_temple_list(e){
        let temple_list;
        let i_dropdown;

        if(e.target.localName === "h1"){
            temple_list = e.target.parentElement.nextSibling.classList;
            i_dropdown = e.target.parentElement.children[0].children[0].classList;
        }
        else{
            temple_list = e.target.parentElement.parentElement.nextSibling.classList;
            i_dropdown = e.target.parentElement.parentElement.children[0].children[0].classList;
        }
        
        temple_list.toggle("temple-list-show");
        i_dropdown.toggle("fa-rotate-m90");
    }

    function close_province_item(e, province){
        setData(current => [...current.filter((value) => value.province !== province)]);
        document.getElementById(province).checked = false;
    }

    function close_province_item_search(e){
        setData_search([]);
    }

    function export2Csv(e, text)
    {
        e.preventDefault();
        let headers = ["Province", "Temple"];
        let dataCsv = '';
        let fileName = '';

        if (text === "all"){
            if(data.length > 0){
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    for (let index_ = 0; index_ < element.temple.length; index_++) {
                        if(index_ === 0) dataCsv += element.province+","+element.temple[index_]+"\n"
                        else dataCsv += ","+element.temple[index_]+"\n"
                    }
                    fileName += "_"+element.province;
                }
            }
            if(data_search.length > 0){
                for (let index = 0; index < data_search.length; index++) {
                    const element = data_search[index];
                    for (let index_ = 0; index_ < element.temple.length; index_++) {
                        if(index_ === 0) dataCsv += element.province+","+element.temple[index_]+"\n"
                        else dataCsv += ","+element.temple[index_]+"\n"
                    }
                    fileName += "_"+element.province;
                }
            }
            
        }
        else{
            let export_comp = false;
            if(data.length > 0){
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if(element.province === text){
                        for (let index_ = 0; index_ < element.temple.length; index_++) {
                            if(index_ === 0) dataCsv += element.province+","+element.temple[index_]+"\n"
                            else dataCsv += ","+element.temple[index_]+"\n"
                        }
                        export_comp = true;
                        fileName += "_"+element.province;
                        break
                    }
                }
            }
            if(data_search.length > 0 & !export_comp){
                for (let index = 0; index < data_search.length; index++) {
                    const element = data_search[index];
                    if(element.province === text){
                        for (let index_ = 0; index_ < element.temple.length; index_++) {
                            if(index_ === 0) dataCsv += element.province+","+element.temple[index_]+"\n"
                            else dataCsv += ","+element.temple[index_]+"\n"
                        }
                        fileName += "_"+element.province;
                    }
                }
            }
            
        }

        const blob = new Blob(["\ufeff"+[headers, dataCsv].join('\n')], {encoding:"UTF-8",type:"text/csv;charset=UTF-8"})
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

  return (
    <div className="container">
      <div className="header">
            <div className="banner">
                <img src={require('./img/banner.png')} alt="" />
            </div>
            <div className="text-banner-wrapper">
                <div className="text-container">
                    <h1>TEMPLES</h1>
                </div>
            </div>
            <div className="subtext-banner-wrapper">
                <div className="subtext-container">
                    <p>เราได้รวบรวมวัดต่าง ๆ ทั่วประเทศไทยไว้ที่นี้ เริ่มการค้นหาของคุณเลย</p>
                </div>
            </div>
            <div className="search-bar">
                <form className="search-form" id="search-form" onSubmit={(e) => province_search(e)}>
                    <label htmlFor="search">ค้นหาจังหวัดที่คุณต้องการ...</label>
                    <div>
                        <input type="text" placeholder="จังหวัด..." id="search" name="search" />
                        <input type="submit" value="ค้นหา" />
                    </div>
                </form>
                <div className="search-select">
                    <label className="search-select-topic">จังหวัดแนะนำ</label>
                    <input type="button" value="เลือกจังหวัดที่แนะนำ V" id="select-province" onClick={(e) => {document.getElementsByClassName("province-list")[0].classList.toggle("select-province-toggle")}} />
                    <div className="province-list">
                        <label htmlFor="สระบุรี">สระบุรี<input type="checkbox" name="สระบุรี" id="สระบุรี" className="select-item"  onChange={(e) => checkbox_change(e)} /><span className="checkmark"></span></label>
                        <label htmlFor="สิงห์บุรี">สิงห์บุรี<input type="checkbox" name="สิงห์บุรี" id="สิงห์บุรี" className="select-item"  onChange={(e) => checkbox_change(e)} /><span className="checkmark"></span></label>
                        <label htmlFor="สุโขทัย">สุโขทัย<input type="checkbox" name="สุโขทัย" id="สุโขทัย" className="select-item"  onChange={(e) => checkbox_change(e)} /><span className="checkmark"></span></label>
                        <label htmlFor="สุพรรณบุรี">สุพรรณบุรี<input type="checkbox" name="สุพรรณบุรี" id="สุพรรณบุรี" className="select-item"  onChange={(e) => checkbox_change(e)} /><span className="checkmark"></span></label>
                        <label htmlFor="สุราษฎร์ธานี">สุราษฎร์ธานี<input type="checkbox" name="สุราษฎร์ธานี" id="สุราษฎร์ธานี" className="select-item"  onChange={(e) => checkbox_change(e)} /><span className="checkmark"></span></label>
                    </div>
                </div>
            </div>
        </div>
        <div className="content" id="content">
            {data.sort((a, b) => a.province.localeCompare(b.province, 'th')).map((element) => (
                <div className="head-item">
                    <div className="head-province-line">
                        <h1 className="head-province" onClick={(e) => toggle_temple_list(e)}><i className="fa-sharp fa-solid fa-circle-chevron-down fa-rotate-m90 i_dropdown"></i>{element.province}<p className='count'>{element.temple.length} วัด</p></h1>
                        <i className="fa-solid fa-arrow-up-from-bracket i_export" onClick={(e) => export2Csv(e, element.province)}></i>
                        <i className="fa-sharp fa-solid fa-circle-xmark i_close" onClick={(e) => close_province_item(e, element.province)}></i>
                    </div>
                    <ul className="temple-list">
                        {element.temple.map((temple) => (
                            <li>{temple}</li>
                        ))}
                    </ul>
                </div>
            ))}
            {data_search.map((element) => (
                <div className="head-item">
                    <div className="head-province-line">
                        <h1 className="head-province" onClick={(e) => toggle_temple_list(e)}><i className="fa-sharp fa-solid fa-circle-chevron-down fa-rotate-m90 i_dropdown"></i>{element.province}<p className='count'>{element.temple.length} วัด</p></h1>
                        <i className="fa-solid fa-arrow-up-from-bracket i_export" onClick={(e) => export2Csv(e, element.province)}></i>
                        <i className="fa-sharp fa-solid fa-circle-xmark i_close" onClick={(e) => close_province_item_search(e)}></i>
                    </div>
                    <ul className="temple-list">
                        {element.temple.map((temple) => (
                            <li>{temple}</li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className={(data.length+data_search.length) >= 1 ? "export-btn" : "export-btn export-btn-hide"}>
                <input type="button" value="Export All" onClick={(e) => export2Csv(e, "all")} />
            </div>
            <div className={(data.length+data_search.length) === 0 ? "no-content" : "no-content-hide"}>
                <h1> ไม่มีข้อมูลวัดของจังหวัดต่างๆ </h1>
            </div>
            <div className='btn_download'>
                <a href={require('./file/_สระบุรี_สิงห์บุรี_สุโขทัย_สุพรรณบุรี_สุราษฎร์ธานี.csv')}>ดาวน์โหลดจังหวัดแนะนำทั้งหมด</a>
            </div>
        </div>
        <div className="footer">
            <p className='git'><span>Code & Regular Expression : </span><a href='https://github.com/Natdanai5037/templebangkok' target="_blank" rel="noreferrer"><i class="fa-brands fa-github"></i></a></p>
            <p className='contact'>Contact us :  ฝูงลิง ∈ ซีซ่าร์ Group</p>
        </div>
        <div className={loading ? "loading" : "loading-hide"}>
            Loading
            <ReactLoading type="bars" color="#F8B148" height={100} width={100} />
        </div>
    </div>
  );
}

export default App;
