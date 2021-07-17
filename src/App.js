import { useEffect, useState } from 'react';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import jsPDF from 'jspdf';
import './App.css';
import fakeData from './fakeData/data.json';

const names$ = from(fakeData);
function App() {
  const [Young, setYoung] = useState([]);
  const [MiddleAge, setMiddleAge] = useState([]);
  const [Older, setOlder] = useState([]);
  const [PdfOption, setPdfOption] = useState("");
  const [DropDownLabel, setDropDownLabel] = useState("Choose an Option");
  useEffect(() => {
    const subscriptionYoung = names$.pipe(filter(val => val.age <= 20)).subscribe(n => setYoung(old => [...old, n]));
    // const subscriptionYoung = names$.pipe(filter(val => val.age <= 10)).subscribe(n => setYoung(n));
    const subscriptionMiddle = names$.pipe(filter(val => val.age <= 50 && val.age > 20)).subscribe(n => setMiddleAge(old => [...old, n]));
    const subscriptionOld = names$.pipe(filter(val => val.age > 50)).subscribe(n => setOlder(old => [...old, n]));
    return () => {
      subscriptionYoung.unsubscribe();
      subscriptionMiddle.unsubscribe();
      subscriptionOld.unsubscribe();
    }
  }, []);
  const percentage = (length) => {
    const total = (Young.length + MiddleAge.length + Older.length);
    const percentage = (length / total * 100);
    return percentage;
  };
  const GeneratePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(document.getElementById(PdfOption)
      , {
        margin:40,
        callback: pdf => {
          pdf.save("report.pdf");
        }
      });
  };
  return (
    <div className="container d-flex pt-5 mt-5">
      <div class="dropdown col-md-9 ">
        <button class="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          {DropDownLabel}
        </button>
        <ul class="dropdown-menu w-100 text-center" aria-labelledby="dropdownMenuButton1">
          <li onClick={() => { setPdfOption("table"); setDropDownLabel("Generation Percentage") }}>Generation Percentage</li>
          <li onClick={() => { setPdfOption("namewise"); setDropDownLabel("Generation by Name") }}>Generation by Name</li>
          <li onClick={() => { setPdfOption("young"); setDropDownLabel("Only Young Aged") }}>Only Young Aged</li>
          <li onClick={() => { setPdfOption("middleAged"); setDropDownLabel("Only Middle Aged") }}>Only Middle Aged</li>
          <li onClick={() => { setPdfOption("older"); setDropDownLabel("Only Old Aged") }}>Only Old Aged</li>
        </ul>
      </div>
      <button className="col-md-3 btn btn-primary" onClick={GeneratePDF}>Generate PDF</button>
      <div className="pdfPage">
        <div id="namewise">
          <div id="young" className="namewise"  >
            <h1>Young</h1>
            <ol>{
              Young && Young.map(y => <li key={y.id}>{y.name}</li>)
            }</ol>
          </div>
          <div id="middleAged" className="namewise"  >
            <h1>MiddleAged</h1>
            <ol>{
              MiddleAge && MiddleAge.map(y => <li key={y.id}>{y.name}</li>)
            }</ol>
          </div>
          <div id="older" className="namewise"  >
            <h1>Old </h1>
            <ol>{
              Older && Older.map(y => <li key={y.id}>{y.name}</li>)
            }</ol>
          </div>
        </div>
        <div id="table">
          <table>
            <thead>
              <tr>
                <th scope="col">Generation</th>
                <th scope="col">Age Level</th>
                <th scope="col">Total People</th>
                <th scope="col">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Young</th>
                <td>0-20</td>
                <td>{Young.length}</td>
                <td>{percentage(Young.length)}</td>
              </tr>
              <tr>
                <th scope="row">MiddleAged</th>
                <td>21-50</td>
                <td>{MiddleAge.length}</td>
                <td>{percentage(MiddleAge.length)}</td>
              </tr>
              <tr>
                <th scope="row">Old</th>
                <td>50+</td>
                <td>{Older.length}</td>
                <td>{percentage(Older.length)}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
