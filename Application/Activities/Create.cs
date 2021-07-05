using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // The current authenticated user that creates an activity is added to the attendee list,
                // and set as the host of the activity.
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                 x.UserName == _userAccessor.GetUsername());

                request.Activity.Date = request.Activity.Date.ToUniversalTime();

                // ActivityAttendee is the joined table record that connects the users and activities
                // (creates many to many relationship between users and activities)
                var hostAttendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                request.Activity.Attendees.Add(hostAttendee);

                // only adding it to memory, not the database yet so no async method is needed
                _context.Activities.Add(request.Activity);

                // SaveChangesAsync returns an integer that represents the number of changes made in the DB
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create activity");

                // this is like returning void
                // it signals to API controller that the command request has finished
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}