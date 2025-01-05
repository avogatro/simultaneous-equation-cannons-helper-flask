
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
