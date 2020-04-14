#pragma checksum "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "4bffb8814bc98de2fd23a9365f00a2ee10a61207"
// <auto-generated/>
#pragma warning disable 1591
#pragma warning disable 0414
#pragma warning disable 0649
#pragma warning disable 0169

namespace CreationCompte.Pages
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#nullable restore
#line 2 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using CreationCompte;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using CreationCompte.Shared;

#line default
#line hidden
#nullable disable
#nullable restore
#line 8 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 9 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using System.Text.RegularExpressions;

#line default
#line hidden
#nullable disable
#nullable restore
#line 10 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Newtonsoft.Json;

#line default
#line hidden
#nullable disable
#nullable restore
#line 12 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using System.IO;

#line default
#line hidden
#nullable disable
#nullable restore
#line 13 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Utils;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
using System.Net.Http;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
using BlazorInputFile;

#line default
#line hidden
#nullable disable
    [Microsoft.AspNetCore.Components.RouteAttribute("/")]
    public partial class Index : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 104 "C:\Users\Mrazz\Source\Repos\nicolasKACEM\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
      

    private string mail = "";
    private string pass = "";
    private string passConfirm = "";
    private string lastName = "";
    private string firstName = "";
    private string job = "";
    private DateTime birthDate = new DateTime();
    private string desc = "";
    private byte[] avatar;
    private bool querySend = false;

    private IList<String> warns = new List<String>();
    private IFileListEntry file;


    public void traiterDemande() {
        querySend = true;
        warns.Clear();
        verifNull();
        verifMail();
        verifPass();
        verifAvatar();
        verifDate();

        if(warns.Count == 0) {
            string hashedPass = HashFunction.hashPassword(pass, out string salt);
            var user = new {
                UserId = 0,
                Email = mail,
                Password = hashedPass,
                Salt = salt,
                BirthDate = birthDate,
                Description = desc,
                FirstName = firstName,
                LastName = lastName,
                Job = job,
                Avatar = avatar
            };

            string output = JsonConvert.SerializeObject(user);
            createUser(output);
        }
        else {
            querySend = false;
        }
        StateHasChanged();
    }

    private async Task createUser(string jsonUser) {

        List<Object> users = await Http.GetJsonAsync<List<Object>>("https://localhost:44329/api/Users");
        int countEqual = 0;
        for(int i = 0; i < users.Count; i++) {
            String userLine = users[i].ToString();
            String mailT = userLine.Split(',')[1].Split(':')[1].Split("\"")[1];
            //await jsRuntime.InvokeAsync<string>("console.log", mail);
            if(mailT.Equals(mail)) {
                countEqual++;
            }
        }
        if(countEqual == 0) {
            await Http.PostJsonAsync("https://localhost:44329/api/Users", jsonUser);
            await jsRuntime.InvokeAsync<object>("alert", "Le compte a bien été créé !");
            querySend = false;
        }
        else {
            await jsRuntime.InvokeAsync<object>("alert", "Le compte éxiste déjà !");
            querySend = false;

        }
        StateHasChanged();

    }

    public async void HandleFileSelected(IFileListEntry[] files) {
        file = files.FirstOrDefault();
        MemoryStream ms = new MemoryStream();
        await file.Data.CopyToAsync(ms);
        avatar = ms.ToArray();

    }


    public void verifNull() {
        if(desc.Trim().Equals("") || mail.Trim().Equals("") || pass.Trim().Equals("") || passConfirm.Trim().Equals("") || lastName.Trim().Equals("") ||
        firstName.Trim().Equals("") || birthDate.ToString().Trim().Equals("")) {
            warns.Add("Merci de remplir les champs obligatoires");
        }
    }

    public void verifMail() {
        Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
        Match match = regex.Match(mail);
        if(!match.Success || match == null) {
            warns.Add("Le mail " + mail + " est incorrect");
        }
    }

    public void verifPass() {
        if(pass.Trim().Length < 5 || pass == null) {
            warns.Add("Mot de passe trop court de " + (5 - pass.Trim().Length));
        }
        if(!(pass.Equals(passConfirm))) {
            warns.Add("Les mots de passe de correspondent pas");
        }
    }

    public void verifAvatar() {
        if(file == null) {
            warns.Add("Merci de fournir un avatar");
        }
        else {
            if(!file.Type.Equals("image/png") && !file.Type.Equals("image/jpg") && !file.Type.Equals("image/jpeg")) {
                warns.Add("Le type de l'avatar doit être jpg, png ou jpeg");
            }
        }

    }

    public void verifDate() {
        if(DateTime.Compare(birthDate, DateTime.Now) >= 0) {
            warns.Add("Merci d'entrer une date correcte");
        }
    }


#line default
#line hidden
#nullable disable
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime jsRuntime { get; set; }
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private HttpClient Http { get; set; }
    }
}
#pragma warning restore 1591
