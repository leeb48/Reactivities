using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        // The http request that comes in can be accessed through the IHttpContextAccessor
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUsername()
        {
            // The ClaimTypes are set during the JWT token creation stage
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}