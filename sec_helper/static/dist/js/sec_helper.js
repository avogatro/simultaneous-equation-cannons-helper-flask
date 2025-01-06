
function changeSolution(send_xyz,send_fusion,returned_xyz,returned_fusion) {
    var solutionInfo = document.getElementById('solution-info');
    solutionInfo.innerHTML = '';
    p = document.createElement("p");
    p.innerText = "Send Xyz "+ send_xyz +" Fusion "+ send_fusion;
    solutionInfo.appendChild(p);

    p = document.createElement("p");
    p.innerText = "Return Xyz "+ returned_xyz +" Fusion "+ returned_fusion;
    solutionInfo.appendChild(p);
}
document.querySelectorAll('.solution').forEach( (element) => {
    element.style.color =element.dataset.color;
});
document.querySelectorAll('.solution-radio').forEach( (element) => {
    element.addEventListener("change", function (event) {
        changeSolution(element.dataset.sendxyz,element.dataset.sendfusion,element.dataset.returnedxyz,element.dataset.returnedfusion);
    });
});
