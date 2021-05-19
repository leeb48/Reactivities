using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _looger;
        private readonly IHostEnvironment _env;

        // Constructor must have RequestDelegate in its parameter
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> looger, IHostEnvironment env)
        {
            _env = env;
            _looger = looger;
            _next = next;
        }

        //This method is required
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Middleware does not do anything when there are not exceptions
                await _next(context);
            }
            catch (Exception ex)
            {
                // Does not call _next() here, thereby ending the Http pipeling process
                _looger.LogError(ex, ex.Message);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new AppException(context.Response.StatusCode, "Server Error");

                // Probably don't need to convert response to json before sending
                // var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                // var jsonRes = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}