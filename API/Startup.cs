using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Activities;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace API
{
    public class Startup
    {

        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        // Add in services that can be injected to other classes
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(opt =>
            {
                // Make sure every single endpoint in the api requires authentication
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(config =>
            {
                // Only have to do once for all of the handlers, as long as we specifiy a class
                // that lives inside the application project
                config.RegisterValidatorsFromAssemblyContaining<ActivityValidator>();
            });

            services.AddApplicationServices(_config);
            services.AddIdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Add middleware here
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Exception handling should be at the start of the middleware pipeline
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            // cors header is added on the way back out to the client
            app.UseCors("CorsPolicy");

            // Authenitcation must go right before authorization
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                // Endpoint for SignalR Hub
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
