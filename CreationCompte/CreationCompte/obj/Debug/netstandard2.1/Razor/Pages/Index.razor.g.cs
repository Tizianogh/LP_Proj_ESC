#pragma checksum "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "d5058b3d3e32c9cd0be66b70336adbdfd29cabdf"
// <auto-generated/>
#pragma warning disable 1591
namespace CreationCompte.Pages
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#nullable restore
#line 2 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using CreationCompte;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using CreationCompte.Shared;

#line default
#line hidden
#nullable disable
#nullable restore
#line 8 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Microsoft.AspNetCore.Authorization;

#line default
#line hidden
#nullable disable
#nullable restore
#line 9 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using System.Text.RegularExpressions;

#line default
#line hidden
#nullable disable
#nullable restore
#line 10 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Newtonsoft.Json;

#line default
#line hidden
#nullable disable
#nullable restore
#line 12 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using System.IO;

#line default
#line hidden
#nullable disable
#nullable restore
#line 13 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\_Imports.razor"
using Utils;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
using System.Net.Http;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
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
            __builder.AddMarkupContent(0, "<h2 id=\"titre\" class=\"text-center my-5\">Création de votre compte</h2>\r\n\r\n        \r\n    ");
            __builder.OpenElement(1, "form");
            __builder.AddMarkupContent(2, "\r\n        ");
            __builder.OpenElement(3, "div");
            __builder.AddAttribute(4, "class", "form-row");
            __builder.AddMarkupContent(5, "\r\n            ");
            __builder.OpenElement(6, "div");
            __builder.AddAttribute(7, "class", "form-group col-md-12");
            __builder.AddMarkupContent(8, "\r\n                ");
            __builder.AddMarkupContent(9, "<label for=\"exampleInputEmail1\">Adresse mail*</label>\r\n                ");
            __builder.OpenElement(10, "input");
            __builder.AddAttribute(11, "type", "email");
            __builder.AddAttribute(12, "class", "input form-control");
            __builder.AddAttribute(13, "aria-describedby", "emailHelp");
            __builder.AddAttribute(14, "placeholder", "Entrer votre email");
            __builder.AddAttribute(15, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 15 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              mail

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(16, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => mail = __value, mail));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(17, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(18, "\r\n        ");
            __builder.CloseElement();
            __builder.AddMarkupContent(19, "\r\n        ");
            __builder.OpenElement(20, "div");
            __builder.AddAttribute(21, "class", "form-row");
            __builder.AddMarkupContent(22, "\r\n            ");
            __builder.OpenElement(23, "div");
            __builder.AddAttribute(24, "class", "form-group col-md-6");
            __builder.AddMarkupContent(25, "\r\n                ");
            __builder.AddMarkupContent(26, "<label for=\"exampleInputPassword1\">Mot de passe*</label>\r\n                ");
            __builder.OpenElement(27, "input");
            __builder.AddAttribute(28, "type", "password");
            __builder.AddAttribute(29, "placeholder", "Mot de passe");
            __builder.AddAttribute(30, "class", "input form-control");
            __builder.AddAttribute(31, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 21 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              pass

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(32, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => pass = __value, pass));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(33, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(34, "\r\n            ");
            __builder.OpenElement(35, "div");
            __builder.AddAttribute(36, "class", "form-group col-md-6");
            __builder.AddMarkupContent(37, "\r\n                ");
            __builder.AddMarkupContent(38, "<label for=\"confirmerMdp\">Confirmer votre mot de passe*</label>\r\n                ");
            __builder.OpenElement(39, "input");
            __builder.AddAttribute(40, "type", "password");
            __builder.AddAttribute(41, "placeholder", "Entrer de nouveau votre mot de passe");
            __builder.AddAttribute(42, "class", "input form-control");
            __builder.AddAttribute(43, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 25 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              passConfirm 

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(44, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => passConfirm  = __value, passConfirm ));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(45, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(46, "\r\n        ");
            __builder.CloseElement();
            __builder.AddMarkupContent(47, "\r\n\r\n        ");
            __builder.OpenElement(48, "div");
            __builder.AddAttribute(49, "class", "form-row");
            __builder.AddMarkupContent(50, "\r\n            ");
            __builder.OpenElement(51, "div");
            __builder.AddAttribute(52, "class", "form-group col-md-6");
            __builder.AddMarkupContent(53, "\r\n                ");
            __builder.AddMarkupContent(54, "<label for=\"lastName\">Nom*</label>\r\n                ");
            __builder.OpenElement(55, "input");
            __builder.AddAttribute(56, "type", "text");
            __builder.AddAttribute(57, "class", "input form-control");
            __builder.AddAttribute(58, "placeholder", "Entrer votre nom");
            __builder.AddAttribute(59, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 32 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              lastName

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(60, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => lastName = __value, lastName));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(61, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(62, "\r\n            ");
            __builder.OpenElement(63, "div");
            __builder.AddAttribute(64, "class", "form-group col-md-6");
            __builder.AddMarkupContent(65, "\r\n                ");
            __builder.AddMarkupContent(66, "<label for=\"firstName\">Prenom*</label>\r\n                ");
            __builder.OpenElement(67, "input");
            __builder.AddAttribute(68, "type", "text");
            __builder.AddAttribute(69, "class", "input form-control");
            __builder.AddAttribute(70, "placeholder", "Entrer votre prenom");
            __builder.AddAttribute(71, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 36 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              firstName

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(72, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => firstName = __value, firstName));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(73, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(74, "\r\n        ");
            __builder.CloseElement();
            __builder.AddMarkupContent(75, "\r\n\r\n        ");
            __builder.OpenElement(76, "div");
            __builder.AddAttribute(77, "class", "form-row");
            __builder.AddMarkupContent(78, "\r\n            ");
            __builder.OpenElement(79, "div");
            __builder.AddAttribute(80, "class", "form-group col-md-6");
            __builder.AddMarkupContent(81, "\r\n                ");
            __builder.AddMarkupContent(82, "<label for=\"job\">Quel poste occupez-vous ?</label>\r\n                ");
            __builder.OpenElement(83, "input");
            __builder.AddAttribute(84, "type", "text");
            __builder.AddAttribute(85, "class", "input form-control");
            __builder.AddAttribute(86, "placeholder", "Entrer votre poste");
            __builder.AddAttribute(87, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 43 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              job

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(88, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => job = __value, job));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(89, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(90, "\r\n            ");
            __builder.OpenElement(91, "div");
            __builder.AddAttribute(92, "class", "form-group col-md-6");
            __builder.AddMarkupContent(93, "\r\n                ");
            __builder.AddMarkupContent(94, "<label for=\"birthDate\">Date de naissance*</label>\r\n                ");
            __builder.OpenElement(95, "input");
            __builder.AddAttribute(96, "type", "date");
            __builder.AddAttribute(97, "class", "input-date form-control");
            __builder.AddAttribute(98, "placeholder", "Entrer votre date de naissance");
            __builder.AddAttribute(99, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 47 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                              birthDate

#line default
#line hidden
#nullable disable
            , format: "yyyy-MM-dd", culture: global::System.Globalization.CultureInfo.InvariantCulture));
            __builder.AddAttribute(100, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => birthDate = __value, birthDate, format: "yyyy-MM-dd", culture: global::System.Globalization.CultureInfo.InvariantCulture));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(101, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(102, "\r\n        ");
            __builder.CloseElement();
            __builder.AddMarkupContent(103, "\r\n\r\n        ");
            __builder.OpenElement(104, "div");
            __builder.AddAttribute(105, "class", "form-row");
            __builder.AddMarkupContent(106, "\r\n            ");
            __builder.OpenElement(107, "div");
            __builder.AddAttribute(108, "class", "form-group col-md-6");
            __builder.AddMarkupContent(109, "\r\n                ");
            __builder.AddMarkupContent(110, "<label for=\"exampleFormControlTextarea1\">Décrivez-vous en quelques mots*</label>\r\n                ");
            __builder.OpenElement(111, "textarea");
            __builder.AddAttribute(112, "class", "input form-control");
            __builder.AddAttribute(113, "rows", "3");
            __builder.AddAttribute(114, "value", Microsoft.AspNetCore.Components.BindConverter.FormatValue(
#nullable restore
#line 54 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                                 desc

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(115, "onchange", Microsoft.AspNetCore.Components.EventCallback.Factory.CreateBinder(this, __value => desc = __value, desc));
            __builder.SetUpdatesAttributeName("value");
            __builder.CloseElement();
            __builder.AddMarkupContent(116, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(117, "\r\n            ");
            __builder.OpenElement(118, "div");
            __builder.AddAttribute(119, "class", "form-group col-md-6");
            __builder.AddMarkupContent(120, "\r\n                ");
            __builder.AddMarkupContent(121, "<label for=\"avatar\">Choisissez votre avatar*</label> <br>\r\n                ");
            __builder.OpenComponent<BlazorInputFile.InputFile>(122);
            __builder.AddAttribute(123, "OnChange", Microsoft.AspNetCore.Components.CompilerServices.RuntimeHelpers.TypeCheck<Microsoft.AspNetCore.Components.EventCallback<BlazorInputFile.IFileListEntry[]>>(Microsoft.AspNetCore.Components.EventCallback.Factory.Create<BlazorInputFile.IFileListEntry[]>(this, 
#nullable restore
#line 58 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                                     HandleFileSelected

#line default
#line hidden
#nullable disable
            )));
            __builder.CloseComponent();
            __builder.AddMarkupContent(124, "\r\n            ");
            __builder.CloseElement();
            __builder.AddMarkupContent(125, "\r\n        ");
            __builder.CloseElement();
            __builder.AddMarkupContent(126, "\r\n");
#nullable restore
#line 61 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
         if (!querySend)
        {

#line default
#line hidden
#nullable disable
            __builder.AddContent(127, "            ");
            __builder.OpenElement(128, "button");
            __builder.AddAttribute(129, "id", "send");
            __builder.AddAttribute(130, "onclick", Microsoft.AspNetCore.Components.EventCallback.Factory.Create<Microsoft.AspNetCore.Components.Web.MouseEventArgs>(this, 
#nullable restore
#line 63 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                                         traiterDemande

#line default
#line hidden
#nullable disable
            ));
            __builder.AddAttribute(131, "class", "btn mb-5");
            __builder.AddMarkupContent(132, "Créer votre compte");
            __builder.CloseElement();
            __builder.AddMarkupContent(133, "\r\n");
#nullable restore
#line 64 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
             foreach (var warn in warns)
            {

#line default
#line hidden
#nullable disable
            __builder.AddContent(134, "                ");
            __builder.OpenElement(135, "p");
            __builder.AddAttribute(136, "class", "alert alert-danger");
            __builder.AddAttribute(137, "role", "alert");
            __builder.AddMarkupContent(138, "\r\n                    ");
            __builder.AddContent(139, 
#nullable restore
#line 67 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
                     warn

#line default
#line hidden
#nullable disable
            );
            __builder.AddMarkupContent(140, "\r\n                ");
            __builder.CloseElement();
            __builder.AddMarkupContent(141, "\r\n");
#nullable restore
#line 69 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
            }

#line default
#line hidden
#nullable disable
#nullable restore
#line 69 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
             
        }

#line default
#line hidden
#nullable disable
            __builder.AddMarkupContent(142, "\r\n");
#nullable restore
#line 72 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
         if (querySend)
        {

#line default
#line hidden
#nullable disable
            __builder.AddMarkupContent(143, "            <div class=\"loader\" style></div>\r\n");
#nullable restore
#line 75 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
        }

        

#line default
#line hidden
#nullable disable
            __builder.AddMarkupContent(144, "\r\n    ");
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#nullable restore
#line 188 "D:\Users\user\Desktop\projetESC\LP_Proj_ESC\CreationCompte\CreationCompte\Pages\Index.razor"
      

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
